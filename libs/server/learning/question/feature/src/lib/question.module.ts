import { Question } from '@els/server/learning/question/data-access/entities';
import { QuestionService } from '@els/server/learning/question/data-access/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionMutationsResolver } from './question-mutations.resolver';
import { QuestionResolver } from './question.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [],
  providers: [QuestionResolver, QuestionService, QuestionMutationsResolver],
  exports: [QuestionService],
})
export class QuestionModule {}
