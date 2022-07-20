// ! If there is a comment (// * custom), the line immediately below it cannot be replaced or removed unless you understand it well

// * custom
/* eslint-disable @typescript-eslint/no-explicit-any */
// * custom
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// * custom
import { GraphqlTypes } from '@els/client/app/shared/data-access';

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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type AccountIdentity = {
  __typename?: 'AccountIdentity';
  authenticationMethods: Array<Scalars['String']>;
  id: Scalars['ID'];
  recoveryAddresses: Array<AccountIdentityRecoveryAddress>;
  state: Scalars['String'];
  traits: AccountIdentityTraits;
  verifiableAddresses?: Maybe<Array<AccountIdentityVerifiableAddress>>;
  // * custom
  user?: Maybe<GraphqlTypes.LearningTypes.User>;
};

/** Plain simple account mutations root object */
export type AccountIdentityMutations = {
  __typename?: 'AccountIdentityMutations';
  create: Session;
  delete: Scalars['Boolean'];
  expirePassword: Scalars['Boolean'];
  preSignAvatarUrl: Scalars['String'];
  requestRecovery: Scalars['Boolean'];
  requestVerify: Scalars['Boolean'];
  updatePassword: AccountIdentity;
  updateProfile: AccountIdentity;
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsCreateArgs = {
  createAccountInput: CreateAccountInput;
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsExpirePasswordArgs = {
  accountId: Scalars['String'];
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsPreSignAvatarUrlArgs = {
  fileName: Scalars['String'];
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsRequestRecoveryArgs = {
  email: Scalars['String'];
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsRequestVerifyArgs = {
  email: Scalars['String'];
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsUpdatePasswordArgs = {
  updatePasswordInput: UpdatePasswordInput;
};


/** Plain simple account mutations root object */
export type AccountIdentityMutationsUpdateProfileArgs = {
  updateProfileInput: UpdateProfileInput;
};

/** Plain simple account queries root object */
export type AccountIdentityQueries = {
  __typename?: 'AccountIdentityQueries';
  /** Check to see if an account by and identity is available */
  available: Scalars['Boolean'];
  /** Retrieves the current logged in account or throws a 401 response */
  current: AccountIdentity;
  linkSocialNetwork: Scalars['String'];
  logout: Scalars['String'];
  whoami: AccountIdentity;
};


/** Plain simple account queries root object */
export type AccountIdentityQueriesAvailableArgs = {
  identity: Scalars['String'];
};


/** Plain simple account queries root object */
export type AccountIdentityQueriesWhoamiArgs = {
  idToken: Scalars['String'];
};

export type AccountIdentityRecoveryAddress = {
  __typename?: 'AccountIdentityRecoveryAddress';
  id: Scalars['String'];
  value: Scalars['String'];
  via: Scalars['String'];
};

export type AccountIdentityTraits = {
  __typename?: 'AccountIdentityTraits';
  email?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  inviter?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type AccountIdentityVerifiableAddress = {
  __typename?: 'AccountIdentityVerifiableAddress';
  id: Scalars['String'];
  status: Scalars['String'];
  value: Scalars['String'];
  verified: Scalars['Boolean'];
  via: Scalars['String'];
};

export type CreateAccountInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  userInvitedId?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type CreateSessionInput = {
  /** Identity field accepts a username or email of an account */
  identity?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
};

/** Plain simple form queries root object */
export type FormQueries = {
  __typename?: 'FormQueries';
  login: Array<Scalars['JSONObject']>;
  registration: Array<Scalars['JSONObject']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Root mutation for all accounts related mutations */
  account?: Maybe<AccountIdentityMutations>;
  /** Root mutation for all sessions related mutations */
  session?: Maybe<SessionMutations>;
};

export type Query = {
  __typename?: 'Query';
  /** Root query for all accounts related queries */
  account?: Maybe<AccountIdentityQueries>;
  accountIdentity?: Maybe<AccountIdentity>;
  /** Root Query for all forms related queries */
  form?: Maybe<FormQueries>;
  /** Root query for all sessions related queries */
  session?: Maybe<SessionQueries>;
};


export type QueryAccountIdentityArgs = {
  id: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  /** This is the jwt token of the account */
  idToken?: Maybe<Scalars['String']>;
};

/** Plain simple session mutations root object */
export type SessionMutations = {
  __typename?: 'SessionMutations';
  create: Session;
  delete: Scalars['Boolean'];
  refresh: Scalars['Boolean'];
};


/** Plain simple session mutations root object */
export type SessionMutationsCreateArgs = {
  createSessionInput: CreateSessionInput;
};

/** Plain simple session queries root object */
export type SessionQueries = {
  __typename?: 'SessionQueries';
  passwordlessToken: Scalars['Boolean'];
};

export type UpdatePasswordInput = {
  confirmPassword: Scalars['String'];
  currentPassword: Scalars['String'];
  password: Scalars['String'];
};

export type UpdateProfileInput = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  middleName?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  userInvitedId?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};
