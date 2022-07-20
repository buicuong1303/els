// ! If there is a comment (// * custom), the line immediately below it cannot be replaced or removed unless you understand it well

// * custom
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AddPhraseInput = {
  phraseId: Scalars['String'];
  wordId: Scalars['String'];
};

export type AddWordToFieldInput = {
  definitionId: Scalars['String'];
  fieldName: Scalars['String'];
};

export type BaseType = {
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
};

export type Concept = BaseType & {
  __typename?: 'Concept';
  antonym?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  joins: Array<Join>;
};

/** Plain simple course mutations root object */
export type ConceptMutations = {
  __typename?: 'ConceptMutations';
  create: Concept;
};


/** Plain simple course mutations root object */
export type ConceptMutationsCreateArgs = {
  createConceptInput: CreateConceptInput;
};

export type Contain = BaseType & {
  __typename?: 'Contain';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  phrase?: Maybe<Phrase>;
  word?: Maybe<Word>;
};

export type CreateConceptInput = {
  description: Scalars['String'];
};

export type CreateExampleInput = {
  definitionId?: InputMaybe<Scalars['String']>;
  phraseId?: InputMaybe<Scalars['String']>;
  sentence: Scalars['String'];
};

export type CreateExampleTranslationInput = {
  exampleId: Scalars['String'];
  lang: Scalars['String'];
  text: Scalars['String'];
};

export type CreateFieldInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreatePhraseInput = {
  explanation: Scalars['String'];
  lang: Scalars['String'];
  text: Scalars['String'];
};

export type CreatePronunciationInput = {
  audioUri?: InputMaybe<Scalars['String']>;
  phonetic: Scalars['String'];
};

export type CreateWordInput = {
  audioUri?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  explanation: Scalars['String'];
  langId: Scalars['String'];
  phonetic: Scalars['String'];
  posId: Scalars['String'];
  text: Scalars['String'];
};

export type Definition = BaseType & {
  __typename?: 'Definition';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  detail?: Maybe<Detail>;
  examples: Array<Example>;
  explanation?: Maybe<Scalars['String']>;
  fieldTb?: Maybe<FieldTb>;
  /** Id */
  id: Scalars['ID'];
  joins: Array<Join>;
  meaning: Meaning;
  pronunciation: Pronunciation;
  synonyms: Array<Word>;
  translates: Array<Word>;
};


export type DefinitionSynonymsArgs = {
  source: Scalars['String'];
};


export type DefinitionTranslatesArgs = {
  target: Scalars['String'];
};

export type Detail = BaseType & {
  __typename?: 'Detail';
  also?: Maybe<Array<Scalars['String']>>;
  antonyms?: Maybe<Array<Scalars['String']>>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  entails?: Maybe<Array<Scalars['String']>>;
  hasCategories?: Maybe<Array<Scalars['String']>>;
  hasInstances?: Maybe<Array<Scalars['String']>>;
  hasMembers?: Maybe<Array<Scalars['String']>>;
  hasParts?: Maybe<Array<Scalars['String']>>;
  hasSubstances?: Maybe<Array<Scalars['String']>>;
  hasTypes?: Maybe<Array<Scalars['String']>>;
  hasUsages?: Maybe<Array<Scalars['String']>>;
  /** Id */
  id: Scalars['ID'];
  inCategory?: Maybe<Array<Scalars['String']>>;
  inRegion?: Maybe<Array<Scalars['String']>>;
  instanceOf?: Maybe<Array<Scalars['String']>>;
  memberOf?: Maybe<Array<Scalars['String']>>;
  partOf?: Maybe<Array<Scalars['String']>>;
  pertainsTo?: Maybe<Array<Scalars['String']>>;
  regionOf?: Maybe<Array<Scalars['String']>>;
  similarTo?: Maybe<Array<Scalars['String']>>;
  substanceOf?: Maybe<Array<Scalars['String']>>;
  typeOf?: Maybe<Array<Scalars['String']>>;
  usageOf?: Maybe<Array<Scalars['String']>>;
};

export type Example = BaseType & {
  __typename?: 'Example';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  definition?: Maybe<Definition>;
  exampleTranslations: Array<ExampleTranslation>;
  /** Id */
  id: Scalars['ID'];
  phrase?: Maybe<Phrase>;
  sentence: Scalars['String'];
  terms?: Maybe<Array<Term>>;
  token: Scalars['String'];
};

/** Plain simple course mutations root object */
export type ExampleMutations = {
  __typename?: 'ExampleMutations';
  create: Example;
  translateExamplesApi: Example;
};


/** Plain simple course mutations root object */
export type ExampleMutationsCreateArgs = {
  createExampleInput: CreateExampleInput;
};


/** Plain simple course mutations root object */
export type ExampleMutationsTranslateExamplesApiArgs = {
  translateExampleInput: TranslateExampleInput;
};

export type ExampleTranslation = BaseType & {
  __typename?: 'ExampleTranslation';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  example?: Maybe<Example>;
  /** Id */
  id: Scalars['ID'];
  lang: Scalars['String'];
  text: Scalars['String'];
};

/** Plain simple course mutations root object */
export type ExampleTranslationMutations = {
  __typename?: 'ExampleTranslationMutations';
  create: ExampleTranslation;
};


/** Plain simple course mutations root object */
export type ExampleTranslationMutationsCreateArgs = {
  createExampleTranslationInput: CreateExampleTranslationInput;
};

export type FieldTb = BaseType & {
  __typename?: 'FieldTb';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  definitions?: Maybe<Array<Definition>>;
  description: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Plain simple course mutations root object */
export type FieldTbMutations = {
  __typename?: 'FieldTbMutations';
  addWordToField: FieldTb;
  create: FieldTb;
};


/** Plain simple course mutations root object */
export type FieldTbMutationsAddWordToFieldArgs = {
  addWordToFieldInput: AddWordToFieldInput;
};


/** Plain simple course mutations root object */
export type FieldTbMutationsCreateArgs = {
  createFieldInput: CreateFieldInput;
};

export type GetFieldArgs = {
  name: Scalars['String'];
};

export type Join = BaseType & {
  __typename?: 'Join';
  concept: Concept;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  definition: Definition;
  /** Id */
  id: Scalars['ID'];
};

export type Lang = {
  __typename?: 'Lang';
  code: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  words: Array<Word>;
};

export type Meaning = BaseType & {
  __typename?: 'Meaning';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  definitions: Array<Definition>;
  /** Id */
  id: Scalars['ID'];
  pos?: Maybe<Pos>;
  word?: Maybe<Word>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Root mutation for all courses related mutations */
  concept?: Maybe<ConceptMutations>;
  /** Root mutation for all courses related mutations */
  example?: Maybe<ExampleMutations>;
  /** Root mutation for all courses related mutations */
  exampleTranslationMutations?: Maybe<ExampleTranslationMutations>;
  /** Root mutation for all courses related mutations */
  field?: Maybe<FieldTbMutations>;
  /** Root mutation for all courses related mutations */
  phrase?: Maybe<PhraseMutations>;
  /** Root mutation for all courses related mutations */
  pronunciation?: Maybe<PronunciationMutations>;
  /** Root mutation for all samples related mutations */
  sample?: Maybe<SampleMutations>;
  /** Root mutation for all courses related mutations */
  word?: Maybe<WordMutations>;
};

export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  total: Scalars['Int'];
};

export type PaginatedWord = {
  __typename?: 'PaginatedWord';
  nodes?: Maybe<Array<Word>>;
  pageInfo?: Maybe<OffsetPageInfo>;
};

export type Phrase = BaseType & {
  __typename?: 'Phrase';
  contains?: Maybe<Array<Contain>>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  examples?: Maybe<Array<Example>>;
  explanation?: Maybe<Scalars['String']>;
  /** Id */
  id: Scalars['ID'];
  lang: Scalars['String'];
  phraseTranslations?: Maybe<Array<PhraseTranslation>>;
  text?: Maybe<Scalars['String']>;
};

/** Plain simple course mutations root object */
export type PhraseMutations = {
  __typename?: 'PhraseMutations';
  create: Phrase;
  importPhraseApi?: Maybe<Phrase>;
  translatePhrase: Phrase;
};


/** Plain simple course mutations root object */
export type PhraseMutationsCreateArgs = {
  createPhraseInput: CreatePhraseInput;
};


/** Plain simple course mutations root object */
export type PhraseMutationsImportPhraseApiArgs = {
  file: Scalars['Upload'];
};


/** Plain simple course mutations root object */
export type PhraseMutationsTranslatePhraseArgs = {
  translatePhrase: TranslatePhrase;
};

export type PhraseTranslation = BaseType & {
  __typename?: 'PhraseTranslation';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  lang: Scalars['String'];
  phrase: Phrase;
  text: Scalars['String'];
};

export type Pos = BaseType & {
  __typename?: 'Pos';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  description: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  meanings: Array<Meaning>;
  name: Scalars['String'];
};

export type Pronunciation = BaseType & {
  __typename?: 'Pronunciation';
  audioUri?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  definitions: Array<Definition>;
  /** Id */
  id: Scalars['ID'];
  phonetic: Scalars['String'];
};

/** Plain simple course mutations root object */
export type PronunciationMutations = {
  __typename?: 'PronunciationMutations';
  createPronunciation: Pronunciation;
};


/** Plain simple course mutations root object */
export type PronunciationMutationsCreatePronunciationArgs = {
  createPronunciationInput: CreatePronunciationInput;
};

export type Query = {
  __typename?: 'Query';
  field: FieldTb;
  getExampleTranslations: Array<ExampleTranslation>;
  phrases: Array<Phrase>;
  pos: Array<Pos>;
  samples: Array<Sample>;
  word?: Maybe<Word>;
  words: PaginatedWord;
};


export type QueryFieldArgs = {
  getFieldArgs: GetFieldArgs;
};


export type QueryWordArgs = {
  search: Scalars['String'];
  source: Scalars['String'];
  target: Scalars['String'];
};


export type QueryWordsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  pageNumber?: InputMaybe<Scalars['Int']>;
};

export type Sample = BaseType & {
  __typename?: 'Sample';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Plain simple Sample mutations root object */
export type SampleMutations = {
  __typename?: 'SampleMutations';
  create: Sample;
  delete: Sample;
  update: Sample;
};

export type SetWordPosInput = {
  posId: Scalars['String'];
  wordId: Scalars['String'];
};

export type Term = BaseType & {
  __typename?: 'Term';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  example: Example;
  /** Id */
  id: Scalars['ID'];
  phraseId: Scalars['String'];
  term: Scalars['String'];
  wordId: Scalars['String'];
};

export type TranslateExampleInput = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type TranslatePhrase = {
  lang: Scalars['String'];
  phraseId: Scalars['String'];
  text: Scalars['String'];
};

export type Word = BaseType & {
  __typename?: 'Word';
  contains?: Maybe<Array<Contain>>;
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  /** Id */
  id: Scalars['ID'];
  lang?: Maybe<Lang>;
  meanings?: Maybe<Array<Meaning>>;
  text?: Maybe<Scalars['String']>;
};

/** Plain simple course mutations root object */
export type WordMutations = {
  __typename?: 'WordMutations';
  addPhrase: Word;
  connectWordApi?: Maybe<Word>;
  create: Word;
  exportFormSample?: Maybe<Array<Definition>>;
  importWordVn: Word;
  setMeaning: Meaning;
};


/** Plain simple course mutations root object */
export type WordMutationsAddPhraseArgs = {
  addPhraseInput: AddPhraseInput;
};


/** Plain simple course mutations root object */
export type WordMutationsConnectWordApiArgs = {
  file: Scalars['Upload'];
};


/** Plain simple course mutations root object */
export type WordMutationsCreateArgs = {
  createWordInput: CreateWordInput;
};


/** Plain simple course mutations root object */
export type WordMutationsExportFormSampleArgs = {
  file: Scalars['Upload'];
};


/** Plain simple course mutations root object */
export type WordMutationsImportWordVnArgs = {
  file: Scalars['Upload'];
};


/** Plain simple course mutations root object */
export type WordMutationsSetMeaningArgs = {
  setWordPosInput: SetWordPosInput;
};
