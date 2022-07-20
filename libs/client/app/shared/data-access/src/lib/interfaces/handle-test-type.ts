import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ReactNode } from 'react';

export interface HandleTestType {
  title: ReactNode;
  subtitle?: ReactNode;
  myTopic?: GraphqlTypes.LearningTypes.Topic;
  vocabularies?: GraphqlTypes.LearningTypes.Vocabulary[];
  studentId?: string;
  memoryAnalyses?: GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>;
  options?: {
    memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus,
  }
}