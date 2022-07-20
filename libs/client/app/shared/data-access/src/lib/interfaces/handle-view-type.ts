import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ReactNode } from 'react';

export interface HandleViewType {
  title: ReactNode;
  subtitle?: ReactNode;
  titleLearning?: ReactNode;
  subtitleLearning?: ReactNode;
  titleTest?: ReactNode;
  subtitleTest?: ReactNode;
  myTopic?: GraphqlTypes.LearningTypes.Topic;
  vocabularies: string[];
  studentId?: string;
  currentLessonId: string;
  memoryAnalyses?: GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>;
  memoryStatus?: GraphqlTypes.LearningTypes.MemoryStatus;
  options?: {
    memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus,
  }
}