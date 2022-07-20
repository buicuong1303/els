/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Category } from '@els/server/learning/category/data-access/entities';
import { MemoryStatus } from '@els/server/learning/common';
import { User } from '@els/server/learning/user/data-access/entities';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { exceptions, Identity } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { GetCategoryDetailsArgs } from '../../../types/src';

@Injectable()
export class CategoryService {
  private readonly _logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
    private readonly _connection: Connection,
  ) {}
  async getCategoryByIds (ids: string[]) {
    return this._categoryRepository.find({ where: {
      id: In(ids)
    }});
  };

  async getAllCategories() {
    return this._categoryRepository.find({
      relations: ['specializations'],
      order: {
        index: 'ASC'
      }
    });
  };

  private _checkWordMemorized(category: Category, user: User) {
    const newSpecializations = category.specializations.map(item => {
      let wordNumber = 0;
      let totalVocabulary = 0;
      item.topics.forEach( topic => {
        if(topic.vocabularies){ 
          totalVocabulary = totalVocabulary + topic.vocabularies?.length;
        }
        if(topic.students){
          topic.students.forEach(student => {
            if(student.userId === user.id) {
              student.memoryAnalyses?.forEach(memoryAnalysis => {
                if(memoryAnalysis.memoryStatus === MemoryStatus.memorized) {
                  wordNumber += 1;
                };
              });
            }
          });
        };
      });
      item.vocabularyMemorized = wordNumber;
      item.totalVocabulary = totalVocabulary;
      return item;
    });
    category.specializations = newSpecializations;
    return category;
  }

  //TODO Landon refactor
  async getCategoryDetails(getCategoryDetailsArgs: GetCategoryDetailsArgs, identity: Identity) {
    let user: any;
    if(getCategoryDetailsArgs.userId){
      user = await this._connection
        .getRepository(User)
        .findOne({
          where: {
            id: getCategoryDetailsArgs.userId,
          }
        });
    } else {
      user = await this._connection
        .getRepository(User)
        .findOne({
          where: {
            identityId: identity.account?.id
          }
        });
    };
    if(!user) throw new exceptions.NotFoundError('Not found User', this._logger);
    const category = await this._connection
      .createQueryBuilder(Category, 'category')
      .leftJoinAndSelect('category.specializations', 'specializations')
      .leftJoinAndSelect('specializations.topics', 'topics')
      .leftJoinAndSelect('topics.vocabularies', 'vocabularies')
      .where('category.id = :categoryId', {categoryId: getCategoryDetailsArgs.categoryId})
      .getOne();
    if(!category) throw new exceptions.NotFoundError('Not found category', this._logger);

    const students = await this._connection
      .createQueryBuilder(Enrollment, 'enrollment')
      .leftJoinAndSelect('enrollment.user', 'user')
      .leftJoinAndSelect('enrollment.topic', 'topic')
      .leftJoinAndSelect('enrollment.memoryAnalyses', 'memoryAnalyses')
      .where('user.id = :userId', {userId: user.id})
      .getMany();

    category.specializations.forEach(item => {
      let total = 0;
      let wordNumber = 0;
      item.topics.forEach(topic => {
        if(topic.vocabularies){
          total = total + topic.vocabularies?.length;
        }
        students.forEach(student => {
          if(student.topic.id === topic.id){
            student.memoryAnalyses?.forEach(memoryAnalyze => {
              if(memoryAnalyze.memoryStatus === MemoryStatus.memorized) {
                wordNumber += 1;
              };
            });
          }
        });
      });
      item.totalVocabulary = total;
      item.vocabularyMemorized = wordNumber;
    });

    const arraySort = category.specializations.sort((item1: any, item2: any) => {
      if (item1['name'].length > item2['name'].length) return 1;
      if (item1['name'].length < item2['name'].length) return -1;
      return 0;
    });

    const arraySort1 = [];
    const arraySort2 = [];

    for (let i = 0; i < arraySort.length; i++) {
      if (i%2 === 0) arraySort1.push(arraySort[i]);
      else arraySort2.push(arraySort[i]);
    };

    const arrayForChart1 = arraySort1.filter((v, i)=>i % 2 === 0).reverse().concat(arraySort1.filter((v, i)=>i % 2 === 1));
    const arrayForChart2 = arraySort2.filter((v, i)=>i % 2 === 0).reverse().concat(arraySort2.filter((v, i)=>i % 2 === 1));

    const arrayForChart = arrayForChart1.concat(arrayForChart2);

    category.specializations = arrayForChart;
    return category;
  }
}
