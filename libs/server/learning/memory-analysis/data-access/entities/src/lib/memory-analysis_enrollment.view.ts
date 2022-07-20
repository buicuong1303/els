/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Enrollment, MemoryStatus } from '@els/server/learning/common';
import { ViewEntity, ViewColumn, Connection } from 'typeorm';
import { MemoryAnalysis } from './memory-analysis.entity';
@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('memoryAnalysis.id', 'id')
      .addSelect('memoryAnalysis.lastStudiedAt', 'lastStudiedAt')
      .addSelect('memoryAnalysis.vocabularyId', 'vocabularyId')
      .addSelect('memoryAnalysis.memoryStatus', 'memoryStatus')
      .addSelect('enrollment.userId', 'userId')
      .addSelect('memoryAnalysis.lastChangedMemoryStatusAt', 'lastChangedMemoryStatusAt')
      .from(MemoryAnalysis, 'memoryAnalysis')
      .leftJoin(Enrollment, 'enrollment', 'enrollment.id = memoryAnalysis.studentId'),
})
export class MemoryAnalysisEnrollment {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  lastChangedMemoryStatusAt!: Date;

  @ViewColumn()
  lastStudiedAt!: Date;
  
  @ViewColumn()
  userId!: string;

  @ViewColumn()
  vocabularyId!: string;
  
  @ViewColumn()
  memoryStatus!: MemoryStatus;

}