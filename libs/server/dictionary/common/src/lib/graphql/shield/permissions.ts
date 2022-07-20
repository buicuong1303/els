import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { allow, or, shield } from 'graphql-shield';
import { isAdmin, isAuthenticated, isEditor, isOwner } from './roles';

const logger = new Logger('Shield');

// setup permission graph
export const permissions = shield(
  {
    // permission on root query
    Query: {
      word: isAuthenticated,
      words: isAuthenticated,
    },
    // permission on root mutation
    Mutation: {
      word: isAuthenticated,
    },

    WordMutations: {
      create: allow,
      importWordVn: or(isEditor, isOwner),
      addPhrase: or(isEditor, isOwner),
      connectWordApi:isAdmin,
      setMeaning: or(isEditor, isOwner)
    },

    SampleMutations: {
      create: or(isEditor, isOwner),
      update: or(isEditor, isOwner),
      delete: or(isEditor, isOwner),
    },

    ExampleMutations: {
      create: or(isEditor, isOwner),
      connectTranslateApi: or(isEditor, isOwner),
    },

    PhraseMutations: {
      create: or(isEditor, isOwner),
      translatePhrase: or(isEditor, isOwner),
    },

    ConceptMutations: {
      create: or(isEditor, isOwner),
    },

    FieldTbMutations: {
      create: or(isEditor, isOwner),
      addWordToField: or(isEditor, isOwner),
    },

    PronunciationMutations: {
      createPronunciation: or(isEditor, isOwner),
    },
    
    ExampleTranslationMutations: {
      create: or(isEditor, isOwner),
    },
  },

  {
    fallbackRule: allow, // deny all, allow request by rule tree
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof ApolloError) {
        // expected errors
        return thrownThing;
      } else if (thrownThing instanceof Error) {
        return new exceptions.InternalServerError(
          'Internal server error',
          logger,
          thrownThing
        );
      } else {
        return new exceptions.UnauthorizedError(
          'Not Authorised!',
          logger,
          thrownThing
        );
      }
    },
  }
);
