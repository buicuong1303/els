/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
      courses: isAuthenticated,
      assignedMissions: isAuthenticated,
    },

    // permission on root mutation
    Mutation: {
      course: isAuthenticated,
    },
    UserMutations: {
      checkIn: isAuthenticated,
    },
    StreakMutations: {
      create: isAuthenticated,
    },
    CourseMutations: {
      create: allow,
      update: or(isEditor, isOwner),
      delete: isAdmin,
    },
    EnrollmentMutations: {
      learnVocabulary: isAuthenticated,
    },
    // permission on field
    Course: {
      id: allow,
      name: allow,
    },
  },

  {
    fallbackRule: allow, // deny all, allow request by rule tree
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
