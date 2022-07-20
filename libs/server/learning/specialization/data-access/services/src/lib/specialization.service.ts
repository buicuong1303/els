/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import {
  CreateSpecializationInput
} from '@els/server/learning/specialization/data-access/types';
import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
export class SpecializationService {
  private readonly _logger = new Logger(SpecializationService.name);
  constructor(
    @InjectRepository(Specialization)
    private readonly _specializationRepository: Repository<Specialization>
  ) {}
  async createSpecialization(createSpecializationInput: CreateSpecializationInput) {
    const { name } = createSpecializationInput;
    //TODO check valid specialization
    const isExistSpecialization = await this._specializationRepository.findOne({
      where: {
        name,
      },
    });
    if (isExistSpecialization)
      throw new exceptions.ConflictError('Specialization has been exist', this._logger);
    try {
      const specialization = this._specializationRepository.create(createSpecializationInput);
      return this._specializationRepository.save(specialization);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    }
  }
  async getSpecializationsByIds(specializationIds: string[]) {
    return this._specializationRepository.find({
      where: {
        id: In(specializationIds)
      }
    });
  }
  
  async findSpecializationsByCategory(categoryId: string) {
    const specializations = await this._specializationRepository.find({ categoryId });
    const arraySort = specializations.sort((item1: any, item2: any) => {
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

    return arrayForChart;
  }
}
