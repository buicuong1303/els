import { ApolloError } from '@apollo/client';

export const handleApolloError = (error: ApolloError, toastify: any) => {
  toastify({
    message: error.message,
    type: 'error',
  });
};
