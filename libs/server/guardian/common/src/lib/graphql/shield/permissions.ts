import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { allow, and, shield } from 'graphql-shield';
import { isAdmin, isAuthenticated } from './roles';

const logger = new Logger('Shield');

// setup permission graph
export const permissions = shield(
  {
    AccountIdentityQueries: {
      current: isAuthenticated,
    },
    SessionMutations: {
      delete: isAuthenticated,
    },
    AccountIdentityMutations: {
      delete: and(isAuthenticated, isAdmin),
      updatePassword: isAuthenticated,
      updateProfile: isAuthenticated,
    },
    // AccountIdentity: isAuthenticated
  },

  {
    
    fallbackRule: allow, // deny all, allow request by rule tree
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof ApolloError) {
        // expected errors
        return thrownThing;
      } else if (thrownThing instanceof Error) {
        // unexpected errors
        logger.error(thrownThing);

        return new ApolloError(
          'Internal server error',
          'INTERNAL_SERVER_ERROR'
        );
      } else {
        // what the hell got thrown
        logger.error('The resolver threw something that is not an error.');
        logger.error(thrownThing);

        return new exceptions.UnauthorizedError('Not Authorized!', logger, thrownThing);
      }
    },
  }
);
