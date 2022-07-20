import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ReactNode } from 'react';

export interface HandleLearningType {
  title: ReactNode;
  subtitle?: ReactNode;
  myTopic?: GraphqlTypes.LearningTypes.Topic;
  vocabularies?: GraphqlTypes.LearningTypes.Vocabulary[];
  studentId?: string;
  memoryAnalyses?: GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>;
  currentLessonId?: string;
  showLessonList?: boolean;
  options?: {
    memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus,
  }
}