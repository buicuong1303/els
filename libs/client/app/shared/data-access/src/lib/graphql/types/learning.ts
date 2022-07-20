// ! If there is a comment (// * custom), the line immediately below it cannot be replaced or removed unless you understand it well

// * custom
/* eslint-disable @typescript-eslint/no-explicit-any */
// * custom
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// * custom
import { GuardianTypes } from '@els/client/guardian/data-access';
// * custom
import { WordReferType } from '@els/client/shared/utils';
// * custom
import { DictionaryTypes } from './';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4Scalar: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONScalar: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AccountIdentity = {
  __typename?: 'AccountIdentity';
  id: Scalars['ID'];
  user?: Maybe<User>;
};

export type ActualSkill = BaseType & {
  __typename?: 'ActualSkill';
  actualSkillHistories: Array<ActualSkillHistory>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  currentLevel: Scalars['Int'];
  /** Id */
  id: Scalars['ID'];
  memoryAnalysis: MemoryAnalysis;
  percent: Scalars['Float'];
  skill: Skill;
  skillLevel: SkillLevel;
};

export type ActualSkillHistory = BaseType & {
  __typename?: 'ActualSkillHistory';
  actualSkill: ActualSkill;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  currentLevel: Scalars['Int'];
  /** Id */
  id: Scalars['ID'];
  memoryAnalysis: MemoryAnalysis;
  percent: Scalars['Float'];
  skill: Skill;
  skillLevel: SkillLevel;
};

export type AddWordInput = {
  vocabularyId: Scalars['String'];
  wordbookId: Scalars['String'];
};

export type AssignMissionInput = {
  userId: Scalars['String'];
};

export type AssignedMission = BaseType & {
  __typename?: 'AssignedMission';
  assignedAt: Scalars['DateTime'];
  completedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  currentProgress: Scalars['Int'];
  expiredAt?: Maybe<Scalars['DateTime']>;
  /** Id */
  id: Scalars['ID'];
  maxProgress: Scalars['Int'];
  mission: Mission;
  missionTarget?: Maybe<MissionTarget>;
  status: AssignedMissionStatus;
  user: User;
};

/** Plain simple assigned mission mutations root object */
export type AssignedMissionMutations = {
  __typename?: 'AssignedMissionMutations';
  doneAssignedMission?: Maybe<AssignedMission>;
};


/** Plain simple assigned mission mutations root object */
export type AssignedMissionMutationsDoneAssignedMissionArgs = {
  doneAssignedMissionInput: DoneAssignedMissionInput;
};

export enum AssignedMissionStatus {
  Completed = 'completed',
  Done = 'done',
  InProgress = 'in_progress',
  Incomplete = 'incomplete',
  Pending = 'pending'
}

export type AvailableMission = BaseType & {
  __typename?: 'AvailableMission';
  assignedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  expiredAt: Scalars['DateTime'];
  /** Id */
  id: Scalars['ID'];
  mission: Mission;
};

export type BaseType = {
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
};

export type Category = BaseType & {
  __typename?: 'Category';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  index?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  specializations?: Maybe<Array<Specialization>>;
  topics?: Maybe<Array<Topic>>;
};

export enum CategoryComment {
  Comment = 'Comment',
  Evaluation = 'Evaluation'
}

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['String'];
  category: CategoryComment;
  children: Array<Scalars['JSONScalar']>;
  createdAt: Scalars['DateTime'];
  entity: Entity;
  parentId?: Maybe<Scalars['String']>;
  rating: Scalars['Float'];
  reactionCount: Scalars['Float'];
  reactions: Array<Reaction>;
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
  userId: Scalars['String'];
};

/** Plain simple comment mutations root object */
export type CommentMutations = {
  __typename?: 'CommentMutations';
  create?: Maybe<Comment>;
  react?: Maybe<Comment>;
  reply?: Maybe<Comment>;
};


/** Plain simple comment mutations root object */
export type CommentMutationsCreateArgs = {
  CreateCommentInput: CreateCommentInput;
};


/** Plain simple comment mutations root object */
export type CommentMutationsReactArgs = {
  reactCommentInput: ReactCommentInput;
};


/** Plain simple comment mutations root object */
export type CommentMutationsReplyArgs = {
  replyCommentInput: ReplyCommentInput;
};

export type Course = BaseType & {
  __typename?: 'Course';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
  sections: Array<Section>;
};

/** Plain simple course mutations root object */
export type CourseMutations = {
  __typename?: 'CourseMutations';
  create: Course;
  delete: Course;
  update: Course;
};


/** Plain simple course mutations root object */
export type CourseMutationsCreateArgs = {
  createCourseInput: CreateCourseInput;
};


/** Plain simple course mutations root object */
export type CourseMutationsDeleteArgs = {
  id: Scalars['String'];
};


/** Plain simple course mutations root object */
export type CourseMutationsUpdateArgs = {
  updateCourseInput: UpdateCourseInput;
};

export type CreateAudioResourceInput = {
  isWord: Scalars['Boolean'];
  transcript: Scalars['String'];
  uri?: InputMaybe<Scalars['String']>;
};

export type CreateCommentInput = {
  category?: InputMaybe<CategoryComment>;
  entityId: Scalars['String'];
  entityName: Scalars['String'];
  rating?: InputMaybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type CreateCourseInput = {
  ipv4?: InputMaybe<Scalars['IPv4Scalar']>;
  name: Scalars['String'];
};

export type CreateDeviceInput = {
  newToken: Scalars['String'];
};

export type CreateEnrollmentInput = {
  topicId: Scalars['String'];
};

export type CreateLessonInput = {
  name: Scalars['String'];
  topicId: Scalars['String'];
};

export type CreateLevelInput = {
  level: Scalars['Int'];
};

export type CreateNotificationScheduleInput = {
  body: Scalars['String'];
  name: Scalars['String'];
  persistent?: InputMaybe<Scalars['Boolean']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
  scheduleAt: Scalars['String'];
  title: Scalars['String'];
  type: ScheduleNotificationType;
};

export type CreateSentenceResourceInput = {
  sentence: Scalars['String'];
  translation: Scalars['String'];
};

export type CreateSkillLevelInput = {
  alpha: Scalars['Float'];
  levelId: Scalars['String'];
  skillId: Scalars['String'];
};

export type CreateTopicInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  specializationId: Scalars['String'];
  thumbnail: Scalars['String'];
};

export type CreateUserInput = {
  identityId: Scalars['String'];
};

export type CreateVideoResourceInput = {
  transcript: Scalars['String'];
  uri: Scalars['String'];
};

export type CreateVocabularyInput = {
  audios?: InputMaybe<Array<CreateAudioResourceInput>>;
  lessonsId: Scalars['String'];
  memoryLevel?: InputMaybe<Scalars['String']>;
  phonetic: Scalars['String'];
  pos: Pos;
  referenceId?: InputMaybe<Scalars['String']>;
  sentences?: InputMaybe<Array<CreateSentenceResourceInput>>;
  topicId: Scalars['String'];
  translation: Scalars['String'];
  videos?: InputMaybe<Array<CreateVideoResourceInput>>;
  vocabulary: Scalars['String'];
};

export type CreateWordBookInput = {
  name: Scalars['String'];
  userId: Scalars['String'];
};

/** Plain simple cron mutations root object */
export type CronMutations = {
  __typename?: 'CronMutations';
  calcMemoryAnalysis?: Maybe<Scalars['String']>;
  handleAssignMission?: Maybe<Scalars['String']>;
  handleComplain1?: Maybe<Scalars['String']>;
  handleCreateActualSkillHistory?: Maybe<Scalars['String']>;
  handleInactiveStreakList?: Maybe<Scalars['String']>;
  handleRemindComeBack?: Maybe<Scalars['String']>;
  handleRemindPracticeAfternoon?: Maybe<Scalars['String']>;
  handleRemindPracticeEvening?: Maybe<Scalars['String']>;
  handleRemindPracticeMidnight?: Maybe<Scalars['String']>;
  handleRemindPracticeMorning?: Maybe<Scalars['String']>;
  handleResetExpDate?: Maybe<Scalars['String']>;
  handleUpdateRank?: Maybe<Scalars['String']>;
  reduceLevelMemoryAnalysis?: Maybe<Scalars['String']>;
};

export type CursorPageInfo = {
  __typename?: 'CursorPageInfo';
  countTotal: Scalars['Int'];
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type DeleteDeviceInput = {
  token: Scalars['String'];
};

export type DeleteLessonsInput = {
  ids: Array<Scalars['String']>;
};

export type DeleteMany = {
  __typename?: 'DeleteMany';
  affected: Scalars['Float'];
};

export type DeleteTopicsInput = {
  ids: Array<Scalars['String']>;
};

export type DeleteVocabulariesInput = {
  ids: Array<Scalars['String']>;
};

export type Device = BaseType & {
  __typename?: 'Device';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  status: Scalars['String'];
  token: Scalars['String'];
  user: User;
  userAgent: Scalars['String'];
  userId: Scalars['String'];
};

/** Plain simple device mutations root object */
export type DeviceMutations = {
  __typename?: 'DeviceMutations';
  create: Device;
  delete?: Maybe<Scalars['String']>;
  update?: Maybe<Device>;
};


/** Plain simple device mutations root object */
export type DeviceMutationsCreateArgs = {
  createDeviceInput: CreateDeviceInput;
};


/** Plain simple device mutations root object */
export type DeviceMutationsDeleteArgs = {
  deleteDeviceInput: DeleteDeviceInput;
};


/** Plain simple device mutations root object */
export type DeviceMutationsUpdateArgs = {
  updateDeviceInput: UpdateDeviceInput;
};

export type DoneAssignedMissionInput = {
  assignedMissionId: Scalars['String'];
};

/** Email response */
export type EmailResponse = {
  __typename?: 'EmailResponse';
  body: Scalars['String'];
  subject: Scalars['String'];
};

export type Enrollment = BaseType & {
  __typename?: 'Enrollment';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  isCompleted: Scalars['Boolean'];
  lastActivityAt?: Maybe<Scalars['DateTime']>;
  memoryAnalyses?: Maybe<Array<MemoryAnalysis>>;
  memoryFluctuations?: Maybe<Scalars['JSONScalar']>;
  summaryMemoryStatus?: Maybe<SummaryMemoryStatus>;
  summarySkill?: Maybe<Scalars['JSONScalar']>;
  topic: Topic;
  user: User;
};

/** Plain simple enrollment mutations root object */
export type EnrollmentMutations = {
  __typename?: 'EnrollmentMutations';
  completeEnrollment?: Maybe<Scalars['String']>;
  create?: Maybe<Enrollment>;
  learnVocabulary?: Maybe<MemoryAnalysis>;
  trackVocabulary?: Maybe<MemoryAnalysis>;
  unTrackVocabulary?: Maybe<MemoryAnalysis>;
  updateMemoryAnalysis?: Maybe<Enrollment>;
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsCompleteEnrollmentArgs = {
  studentId: Scalars['String'];
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsCreateArgs = {
  createEnrollmentInput: CreateEnrollmentInput;
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsLearnVocabularyArgs = {
  learnVocabularyInput: LearnVocabularyInput;
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsTrackVocabularyArgs = {
  memoryAnalysisId: Scalars['String'];
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsUnTrackVocabularyArgs = {
  unTrackVocabularyInput: UnTrackVocabularyInput;
};


/** Plain simple enrollment mutations root object */
export type EnrollmentMutationsUpdateMemoryAnalysisArgs = {
  updateMemoryAnalysisInput: UpdateMemoryAnalysisInput;
};

export type Entity = {
  __typename?: 'Entity';
  createdAt: Scalars['String'];
  entityId: Scalars['String'];
  entityName: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type EntityType = BaseType & {
  __typename?: 'EntityType';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  entity: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  notificationObjects: Array<NotificationObject>;
};

export type GenerateResourceInput = {
  category: Scalars['String'];
  topicId?: InputMaybe<Scalars['String']>;
};

export type GetVocabulariesInput = {
  vocabularyIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type InvitationAcceptInput = {
  inviterId: Scalars['String'];
};

/** Plain simple account mutations root object */
export type InvitationMutations = {
  __typename?: 'InvitationMutations';
  accept?: Maybe<Scalars['String']>;
};


/** Plain simple account mutations root object */
export type InvitationMutationsAcceptArgs = {
  invitationAcceptInput: InvitationAcceptInput;
};

/** Plain simple account queries root object */
export type InvitationQueries = {
  __typename?: 'InvitationQueries';
  emailInviter: EmailResponse;
  getLink: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  code: Scalars['String'];
  fromTopics: Array<Topic>;
  id: Scalars['String'];
  learningTopics: Array<Topic>;
  name: Scalars['String'];
};

export type LearnVocabularyInput = {
  lessonId: Scalars['String'];
  skills: Array<Scalars['String']>;
  vocabularyId: Scalars['String'];
};

export type Lesson = BaseType & {
  __typename?: 'Lesson';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  level: Scalars['Int'];
  memoryAnalyses: Array<MemoryAnalysis>;
  name: Scalars['String'];
  topic: Topic;
  vocabularies: Array<Vocabulary>;
};

/** Plain simple course mutations root object */
export type LessonMutations = {
  __typename?: 'LessonMutations';
  create: Lesson;
  deleteMany: DeleteMany;
  restoreMany: DeleteMany;
};


/** Plain simple course mutations root object */
export type LessonMutationsCreateArgs = {
  createLessonInput: CreateLessonInput;
};


/** Plain simple course mutations root object */
export type LessonMutationsDeleteManyArgs = {
  deleteLessonInput: DeleteLessonsInput;
};


/** Plain simple course mutations root object */
export type LessonMutationsRestoreManyArgs = {
  restoreLessonInput: RestoreLessonsInput;
};

export type Level = BaseType & {
  __typename?: 'Level';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  level: Scalars['Int'];
  skillLevels: Array<SkillLevel>;
};

/** Plain simple level mutations root object */
export type LevelMutations = {
  __typename?: 'LevelMutations';
  create: Level;
};


/** Plain simple level mutations root object */
export type LevelMutationsCreateArgs = {
  createLevelInput: CreateLevelInput;
};

export type MarkStreakInput = {
  streakListId?: InputMaybe<Scalars['String']>;
};

export type MemoryAnalysis = BaseType & {
  __typename?: 'MemoryAnalysis';
  actualSkills: Array<ActualSkill>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  isFirstTime: Scalars['Boolean'];
  lastChangedMemoryStatusAt: Scalars['DateTime'];
  lastMemoryStatus?: Maybe<MemoryStatus>;
  lastStudiedAt: Scalars['DateTime'];
  lesson: Lesson;
  memoryStatus: MemoryStatus;
  // * custom
  student?: Enrollment;
  // * custom
  unTrackingMode?: UnTrackingMode;
  vocabulary: Vocabulary;
};

export enum MemoryStatus {
  Forgot = 'forgot',
  Memorized = 'memorized',
  New = 'new',
  Vague = 'vague'
}

export type Mission = BaseType & {
  __typename?: 'Mission';
  assignedMissions: Array<AssignedMission>;
  availableMissions: Array<AvailableMission>;
  code: MissionCode;
  cooldownTime?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  durationHours?: Maybe<Scalars['Int']>;
  iconUri?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  maxProgress: Scalars['Int'];
  missionTargets: Array<MissionTarget>;
  mode: Scalars['String'];
  repeatable: Scalars['String'];
  reward: Reward;
  title: Scalars['String'];
  titleEn: Scalars['String'];
  type: Scalars['String'];
};

export enum MissionCode {
  CheckIn = 'check_in',
  Complete_1Topic = 'complete_1_topic',
  Complete_2Topics = 'complete_2_topics',
  Invite_5Persons = 'invite_5_persons',
  LearnNew = 'learn_new',
  ObtainLevel_10 = 'obtain_level_10',
  ReviewForgot = 'review_forgot',
  ReviewVague = 'review_vague',
  Streaks_3 = 'streaks_3',
  Streaks_5 = 'streaks_5',
  Top_1 = 'top_1'
}

/** Plain simple mission mutations root object */
export type MissionMutations = {
  __typename?: 'MissionMutations';
  assignNoneRepeatableMission?: Maybe<AssignedMission>;
};


/** Plain simple mission mutations root object */
export type MissionMutationsAssignNoneRepeatableMissionArgs = {
  assignMissionInput: AssignMissionInput;
};

export type MissionTarget = BaseType & {
  __typename?: 'MissionTarget';
  assignedMissions: Array<AssignedMission>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  maxProgress: Scalars['Int'];
  mission: Mission;
  status: Scalars['String'];
  student?: Maybe<Enrollment>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignedMission?: Maybe<AssignedMissionMutations>;
  /** Root mutation for all comment related comments */
  comment?: Maybe<CommentMutations>;
  /** Root mutation for all courses related mutations */
  course?: Maybe<CourseMutations>;
  /** Root mutation for all cron related comments */
  cron?: Maybe<CronMutations>;
  device?: Maybe<DeviceMutations>;
  enrollment?: Maybe<EnrollmentMutations>;
  /** Root mutation for all accounts related mutations */
  invitation?: Maybe<InvitationMutations>;
  /** Root mutation for all courses related mutations */
  lesson?: Maybe<LessonMutations>;
  level?: Maybe<LevelMutations>;
  mission?: Maybe<MissionMutations>;
  notification?: Maybe<NotificationMutations>;
  question?: Maybe<QuestionMutations>;
  rank?: Maybe<RankMutations>;
  settings?: Maybe<SettingMutations>;
  skill?: Maybe<SkillMutations>;
  skillLevel?: Maybe<SkillLevelMutations>;
  streak?: Maybe<StreakMutations>;
  /** Root mutation for all courses related mutations */
  topic?: Maybe<TopicMutations>;
  user?: Maybe<UserMutations>;
  vocabulary?: Maybe<VocabularyMutations>;
  wordbook?: Maybe<WordbookMutations>;
};

export type Notification = BaseType & {
  __typename?: 'Notification';
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  notificationObject: NotificationObject;
  notifier: User;
  status: Scalars['String'];
  title: Scalars['String'];
};

export type NotificationChange = BaseType & {
  __typename?: 'NotificationChange';
  actor: User;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  notificationObject: NotificationObject;
};

export type NotificationData = {
  __typename?: 'NotificationData';
  actor: Scalars['String'];
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  link: Scalars['String'];
  message: Scalars['String'];
  status: Scalars['String'];
};

/** Plain simple notification mutations root object */
export type NotificationMutations = {
  __typename?: 'NotificationMutations';
  create: Notification;
  read: Notification;
  runScheduleNotification: Notification;
};


/** Plain simple notification mutations root object */
export type NotificationMutationsCreateArgs = {
  createNotificationScheduleInput: CreateNotificationScheduleInput;
};


/** Plain simple notification mutations root object */
export type NotificationMutationsReadArgs = {
  readNotificationInput: ReadNotificationInput;
};


/** Plain simple notification mutations root object */
export type NotificationMutationsRunScheduleNotificationArgs = {
  scheduleNotificationId: Scalars['String'];
};

export type NotificationObject = BaseType & {
  __typename?: 'NotificationObject';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  entityId: Scalars['String'];
  entityType: EntityType;
  /** Id */
  id: Scalars['ID'];
  notifications: Array<Notification>;
};

export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  total: Scalars['Int'];
};

export enum Pos {
  Adj = 'adj',
  Adv = 'adv',
  N = 'n',
  V = 'v'
}

export type PaginatedRank = {
  __typename?: 'PaginatedRank';
  nodes?: Maybe<Array<Rank>>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type PaginatedTopic = {
  __typename?: 'PaginatedTopic';
  nodes?: Maybe<Array<Topic>>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type Phrase = {
  __typename?: 'Phrase';
  id: Scalars['ID'];
  vocabulary: Vocabulary;
};

export type Prompt = BaseType & {
  __typename?: 'Prompt';
  audio?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  question: Question;
  text?: Maybe<Scalars['String']>;
  topic: Topic;
  video?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  assignedMissions: Array<AssignedMission>;
  attendanceUser: Array<AssignedMission>;
  categories: Array<Category>;
  categoryDetails: Category;
  comments?: Maybe<Array<Comment>>;
  courses: Array<Course>;
  enrollment?: Maybe<Enrollment>;
  evaluations?: Maybe<Array<Comment>>;
  getDevice?: Maybe<Scalars['String']>;
  /** Root query for all accounts related queries */
  invitation?: Maybe<InvitationQueries>;
  lesson: Lesson;
  lessons: Array<Lesson>;
  levels: Array<Level>;
  missions: Array<Mission>;
  myRank: Rank;
  myTopicDetails?: Maybe<Array<Topic>>;
  myTopics?: Maybe<Array<Topic>>;
  notifications: Array<NotificationData>;
  questions: Array<Question>;
  quickTest: Array<Question>;
  rankType: Array<RankType>;
  rankTypeFromCache: RankType;
  rankUserInfo: RankUserInfo;
  ranks: PaginatedRank;
  streakList?: Maybe<StreakList>;
  /** Root mutation for all courses related mutations */
  topic?: Maybe<TopicQueries>;
  topics?: Maybe<PaginatedTopic>;
  user: User;
  usersAcceptInvitation: Array<User>;
  vocabularies: Array<Vocabulary>;
  vocabulariesWorkbook: Array<Vocabulary>;
};


export type QueryAssignedMissionsArgs = {
  category: Scalars['String'];
};


export type QueryCategoryDetailsArgs = {
  categoryId: Scalars['String'];
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryCommentsArgs = {
  entityId: Scalars['String'];
  entityName: Scalars['String'];
};


export type QueryCoursesArgs = {
  ids: Array<Scalars['String']>;
};


export type QueryEnrollmentArgs = {
  topicId: Scalars['String'];
};


export type QueryEvaluationsArgs = {
  entityId: Scalars['String'];
  entityName: Scalars['String'];
};


export type QueryLessonArgs = {
  id: Scalars['String'];
};


export type QueryLessonsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryMyRankArgs = {
  rankType: Scalars['String'];
};


export type QueryMyTopicDetailsArgs = {
  studentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryQuestionsArgs = {
  equipments: Array<Scalars['String']>;
  topicId?: InputMaybe<Scalars['String']>;
  vocabularyIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryQuickTestArgs = {
  equipments: Array<Scalars['String']>;
  numberOfQuestions: Scalars['Int'];
  topicIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryRankUserInfoArgs = {
  userId: Scalars['String'];
};


export type QueryRanksArgs = {
  ids?: InputMaybe<Array<Scalars['String']>>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  pageNumber?: InputMaybe<Scalars['Int']>;
};


export type QueryStreakListArgs = {
  userId: Scalars['String'];
};


export type QueryTopicsArgs = {
  category?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  pageNumber?: InputMaybe<Scalars['Int']>;
  specs?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryUserArgs = {
  inviterId?: InputMaybe<Scalars['String']>;
};


export type QueryVocabulariesArgs = {
  getVocabulariesInput: GetVocabulariesInput;
};


export type QueryVocabulariesWorkbookArgs = {
  wordbookId: Scalars['String'];
};

export type Question = BaseType & {
  __typename?: 'Question';
  action: QuestionAction;
  choices: Scalars['String'];
  correctAnswer: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  duration: Scalars['Float'];
  equipments: Array<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  level: Scalars['Int'];
  prompt: Prompt;
  skills: Array<Scalars['String']>;
  sourceLang: Scalars['String'];
  targetLang: Scalars['String'];
  type: QuestionType;
  vocabulary: Vocabulary;
};

export enum QuestionAction {
  Arrange = 'arrange',
  Select = 'select',
  SelectCard = 'select_card',
  Speak = 'speak',
  Type = 'type',
  Write = 'write'
}

/** Plain simple question mutations root object */
export type QuestionMutations = {
  __typename?: 'QuestionMutations';
  generateQuestions: Scalars['String'];
};


/** Plain simple question mutations root object */
export type QuestionMutationsGenerateQuestionsArgs = {
  topicId: Scalars['String'];
};

export enum QuestionType {
  Fill = 'fill',
  ShortInput = 'short_input',
  Speak = 'speak',
  Translate = 'translate'
}

export type Rank = BaseType & {
  __typename?: 'Rank';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  elo?: Maybe<RankElo>;
  /** Id */
  id: Scalars['ID'];
  number?: Maybe<Scalars['Float']>;
  numberChange?: Maybe<Scalars['Float']>;
  rankType: RankType;
  user: User;
};

export type RankElo = {
  __typename?: 'RankElo';
  exp?: Maybe<Scalars['Float']>;
  level?: Maybe<Scalars['Float']>;
  nextExp?: Maybe<Scalars['Float']>;
  topic?: Maybe<Scalars['Float']>;
  word?: Maybe<Scalars['Float']>;
};

/** Plain simple mission mutations root object */
export type RankMutations = {
  __typename?: 'RankMutations';
  update?: Maybe<Rank>;
};

export type RankType = BaseType & {
  __typename?: 'RankType';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  rank: Array<Rank>;
};

export type RankUserInfo = {
  __typename?: 'RankUserInfo';
  attendance?: Maybe<Scalars['Float']>;
  currentStreak?: Maybe<Scalars['Float']>;
  fromLang?: Maybe<Scalars['String']>;
  learningLang?: Maybe<Scalars['String']>;
  rankInfo?: Maybe<RankElo>;
  userInfo?: Maybe<User>;
};

export type ReactCommentInput = {
  commentId: Scalars['String'];
  emoji: Scalars['String'];
};

export type Reaction = {
  __typename?: 'Reaction';
  _id: Scalars['String'];
  comment: Comment;
  createdAt: Scalars['String'];
  emoji: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type ReadNotificationInput = {
  ids?: InputMaybe<Array<Scalars['String']>>;
};

// * custom
export type ReferenceUnion = DictionaryTypes.Phrase | DictionaryTypes.Word;
// export type ReferenceUnion = Phrase | Word;

export type RemoveWordInput = {
  userId: Scalars['String'];
  word: Scalars['String'];
};

export type ReplyCommentInput = {
  entityId: Scalars['String'];
  entityName: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
};

export type Resource = BaseType & {
  __typename?: 'Resource';
  category: ResourceCategory;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  isWord: Scalars['Boolean'];
  topic: Topic;
  transcript: Scalars['String'];
  translation: Scalars['String'];
  uri: Scalars['String'];
  vocabulary: Vocabulary;
};

export enum ResourceCategory {
  Audio = 'audio',
  Image = 'image',
  Sentence = 'sentence',
  Video = 'video'
}

export type RestoreLessonsInput = {
  ids: Array<Scalars['String']>;
};

export type Reward = BaseType & {
  __typename?: 'Reward';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  missions: Mission;
  rewardUnit: RewardUnit;
  value: Scalars['Int'];
};

export type RewardUnit = BaseType & {
  __typename?: 'RewardUnit';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
  rewards?: Maybe<Array<Reward>>;
};

export enum ScheduleNotificationType {
  Discount = 'DISCOUNT',
  NewTopic = 'NEW_TOPIC'
}

export type Section = {
  __typename?: 'Section';
  courseId: Scalars['String'];
  /** Id */
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Setting = BaseType & {
  __typename?: 'Setting';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  exp?: Maybe<Scalars['Float']>;
  fromLang?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  learningLang?: Maybe<Scalars['String']>;
  listen?: Maybe<Scalars['Boolean']>;
  notification?: Maybe<Scalars['Boolean']>;
  sound?: Maybe<Scalars['Boolean']>;
  speak?: Maybe<Scalars['Boolean']>;
  user: User;
};

/** Plain simple setting mutations root object */
export type SettingMutations = {
  __typename?: 'SettingMutations';
  updateApp: Setting;
  updateTarget: Setting;
};


/** Plain simple setting mutations root object */
export type SettingMutationsUpdateAppArgs = {
  updateSettingAppInput: UpdateSettingAppInput;
};


/** Plain simple setting mutations root object */
export type SettingMutationsUpdateTargetArgs = {
  updateSettingTarget: UpdateSettingTargetInput;
};

export type Skill = BaseType & {
  __typename?: 'Skill';
  actualSkills?: Maybe<ActualSkill>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
  skillLevels: SkillLevel;
};

export type SkillLevel = BaseType & {
  __typename?: 'SkillLevel';
  actualSkills: Array<ActualSkill>;
  alpha: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  level: Level;
  skill: Skill;
};

/** Plain simple skill-level mutations root object */
export type SkillLevelMutations = {
  __typename?: 'SkillLevelMutations';
  create: SkillLevel;
  update: SkillLevel;
};


/** Plain simple skill-level mutations root object */
export type SkillLevelMutationsCreateArgs = {
  createSkillLevelInput: CreateSkillLevelInput;
};


/** Plain simple skill-level mutations root object */
export type SkillLevelMutationsUpdateArgs = {
  updateSkillLevelInput: UpdateSkillLevelInput;
};

/** Plain simple skill mutations root object */
export type SkillMutations = {
  __typename?: 'SkillMutations';
  update: Skill;
};


/** Plain simple skill mutations root object */
export type SkillMutationsUpdateArgs = {
  updateSkillInput: UpdateSkillInput;
};

export type Specialization = BaseType & {
  __typename?: 'Specialization';
  category: Category;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
  topics: Array<Topic>;
  totalVocabulary: Scalars['Float'];
  vocabularyMemorized: Scalars['Float'];
};

export type Streak = BaseType & {
  __typename?: 'Streak';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  expDate: Scalars['Int'];
  expTarget: Scalars['Int'];
  /** Id */
  id: Scalars['ID'];
  streakList: StreakList;
};

export type StreakList = BaseType & {
  __typename?: 'StreakList';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  status: Scalars['String'];
  streaks: Array<Streak>;
  user: User;
};

/** Plain simple streak mutations root object */
export type StreakMutations = {
  __typename?: 'StreakMutations';
  create?: Maybe<Streak>;
};


/** Plain simple streak mutations root object */
export type StreakMutationsCreateArgs = {
  markStreakInput: MarkStreakInput;
};

export type SummaryMemoryStatus = {
  __typename?: 'SummaryMemoryStatus';
  forgotVocabularies?: Maybe<Array<string>>;
  memorizedVocabularies?: Maybe<Array<string>>;
  newVocabularies?: Maybe<Array<string>>;
  vagueVocabularies?: Maybe<Array<string>>;
};

export type SyncThumbnailTopicInput = {
  topicId?: InputMaybe<Scalars['String']>;
};

export type Topic = BaseType & {
  __typename?: 'Topic';
  category: Category;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description: Scalars['String'];
  fromLang: Language;
  /** Id */
  id: Scalars['ID'];
  lastStudiedAt?: Maybe<Scalars['DateTime']>;
  learningLang: Language;
  lessons: Array<Lesson>;
  name: Scalars['String'];
  numberOfParticipants: Scalars['Int'];
  prompts: Array<Prompt>;
  rating: Scalars['Float'];
  resources: Array<Resource>;
  specialization: Specialization;
  students?: Maybe<Array<Enrollment>>;
  thumbnailUri: Scalars['String'];
  vocabularies: Array<Vocabulary>;
};

/** Plain simple topic mutations root object */
export type TopicMutations = {
  __typename?: 'TopicMutations';
  checkVocabularyMemorized?: Maybe<Topic>;
  create: Topic;
  deleteMany: DeleteMany;
  importTopic?: Maybe<Scalars['String']>;
  restoreMany: DeleteMany;
  syncThumbnailTopic?: Maybe<Topic>;
  uploadMissedAudio?: Maybe<Scalars['String']>;
};


/** Plain simple topic mutations root object */
export type TopicMutationsCreateArgs = {
  createTopicInput: CreateTopicInput;
};


/** Plain simple topic mutations root object */
export type TopicMutationsDeleteManyArgs = {
  deleteTopicsInput: DeleteTopicsInput;
};


/** Plain simple topic mutations root object */
export type TopicMutationsImportTopicArgs = {
  file: Scalars['Upload'];
};


/** Plain simple topic mutations root object */
export type TopicMutationsRestoreManyArgs = {
  restoreTopicsInput: DeleteTopicsInput;
};


/** Plain simple topic mutations root object */
export type TopicMutationsSyncThumbnailTopicArgs = {
  syncThumbnailTopicInput: SyncThumbnailTopicInput;
};

/** Plain simple topic queries root object */
export type TopicQueries = {
  __typename?: 'TopicQueries';
  getActualSkillHistory: Scalars['JSONScalar'];
};


/** Plain simple topic queries root object */
export type TopicQueriesGetActualSkillHistoryArgs = {
  period: Scalars['String'];
  skill: Scalars['String'];
  studentId: Scalars['String'];
};

export type UnTrackVocabularyInput = {
  lessonId: Scalars['String'];
  studentId: Scalars['String'];
  unTrackingMode: UnTrackingMode;
  vocabularyId: Scalars['String'];
};

export enum UnTrackingMode {
  System = 'system',
  Topic = 'topic'
}

export type UpdateCourseInput = {
  id: Scalars['String'];
  ipv4?: InputMaybe<Scalars['IPv4Scalar']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateDeviceInput = {
  token: Scalars['String'];
};

export type UpdateMemoryAnalysisInput = {
  answer: Scalars['String'];
  questionId: Scalars['String'];
};

export type UpdateSettingAppInput = {
  fromLang: Scalars['String'];
  learningLang: Scalars['String'];
  listen: Scalars['Boolean'];
  notification: Scalars['Boolean'];
  sound: Scalars['Boolean'];
  speak: Scalars['Boolean'];
};

export type UpdateSettingTargetInput = {
  exp: Scalars['Float'];
  learnNew: Scalars['Float'];
  reviewForgot: Scalars['Float'];
  reviewVague: Scalars['Float'];
};

export type UpdateSkillInput = {
  name: Scalars['String'];
  skillId: Scalars['String'];
};

export type UpdateSkillLevelInput = {
  alpha: Scalars['Float'];
  skillLevelId: Scalars['String'];
};

export type User = BaseType & {
  __typename?: 'User';
  assignedMissions: Array<AssignedMission>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  devices: Array<Device>;
  enrollments: Array<Enrollment>;
  exp: Scalars['Int'];
  expDate: Scalars['Int'];
  extraInfo?: Maybe<Scalars['JSONScalar']>;
  /** Id */
  id: Scalars['ID'];
  // * custom
  identity?: GuardianTypes.AccountIdentity;
  identityId: Scalars['String'];
  ignoredWords?: Maybe<Array<Scalars['String']>>;
  level: Scalars['Int'];
  listInvited: Array<User>;
  memoryAnalyses?: Maybe<Array<MemoryAnalysis>>;
  memoryFluctuations?: Maybe<Scalars['JSONScalar']>;
  missionTargets: Array<MissionTarget>;
  nextLevelExp: Scalars['Int'];
  notificationChanges: Array<NotificationChange>;
  notifications: Array<Notification>;
  rank: Array<Rank>;
  setting?: Maybe<Scalars['JSONScalar']>;
  streakLists?: Maybe<Array<StreakList>>;
  summaryMemoryStatus?: Maybe<SummaryMemoryStatus>;
  userInvited: User;
  wordbooks: Array<Wordbook>;
};

/** Plain simple user mutations root object */
export type UserMutations = {
  __typename?: 'UserMutations';
  checkIn?: Maybe<Scalars['String']>;
  create: User;
  removeWordFromIgnoreList: User;
  update: User;
};


/** Plain simple user mutations root object */
export type UserMutationsCreateArgs = {
  createUserInput: CreateUserInput;
};


/** Plain simple user mutations root object */
export type UserMutationsRemoveWordFromIgnoreListArgs = {
  removeWordInput: RemoveWordInput;
};

export type Vocabulary = BaseType & {
  __typename?: 'Vocabulary';
  audio?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  lesson: Lesson;
  level: Scalars['Int'];
  memoryAnalyses: Array<MemoryAnalysis>;
  memoryLevel: Scalars['String'];
  phonetic: Scalars['String'];
  pos: Scalars['String'];
  questions: Array<Question>;
  reference?: Maybe<ReferenceUnion>;
  referenceId?: Maybe<Scalars['String']>;
  resources: Array<Resource>;
  topic: Topic;
  translation: Scalars['String'];
  type: Scalars['String'];
  vocabulary: Scalars['String'];
  // * custom
  referData?: Maybe<WordReferType>;
};

export type VocabularyMutations = {
  __typename?: 'VocabularyMutations';
  create: Vocabulary;
  deleteMany: DeleteMany;
  generateResource: Scalars['String'];
  linkWords: Scalars['String'];
};


export type VocabularyMutationsCreateArgs = {
  createVocabularyInput: CreateVocabularyInput;
};


export type VocabularyMutationsDeleteManyArgs = {
  deleteVocabulariesInput: DeleteVocabulariesInput;
};


export type VocabularyMutationsGenerateResourceArgs = {
  generateResourceInput: GenerateResourceInput;
};


export type VocabularyMutationsLinkWordsArgs = {
  topicId: Scalars['String'];
};

export type Word = {
  __typename?: 'Word';
  id: Scalars['ID'];
  vocabulary: Vocabulary;
};

export type Wordbook = BaseType & {
  __typename?: 'Wordbook';
  bookmarkWords?: Maybe<Array<Scalars['String']>>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
  user: User;
  vocabularies?: Maybe<Array<Vocabulary>>;
};

/** Plain simple wordbook mutations root object */
export type WordbookMutations = {
  __typename?: 'WordbookMutations';
  addWord: Wordbook;
  create: Wordbook;
  removeWord: Wordbook;
};


/** Plain simple wordbook mutations root object */
export type WordbookMutationsAddWordArgs = {
  addWordInput: AddWordInput;
};


/** Plain simple wordbook mutations root object */
export type WordbookMutationsCreateArgs = {
  createWordbookInput: CreateWordBookInput;
};


/** Plain simple wordbook mutations root object */
export type WordbookMutationsRemoveWordArgs = {
  addWordInput: AddWordInput;
};
