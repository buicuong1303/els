/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable react/jsx-no-useless-fragment */
import { FC, Fragment, ReactNode, useContext } from 'react';
import { ApolloClient } from '@els/client/shared/data-access';
import { useQuery } from '@apollo/client';
import { Loading } from '@els/client/app/shared/ui';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { GraphqlQueries } from '@els/client/app/shared/data-access';
import jsCookies from 'js-cookie';

interface AuthGuardProps {
  children: ReactNode;
}
const AuthGuard: FC<AuthGuardProps> = (props) => {
  const { children } = props;

  const { toastify } = useContext(ToastifyContext);

  const { loading, error } = useQuery(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      variables: {
        inviterId: jsCookies.get('inviter_id'),
      }
    }
  );

  if (loading) return <Loading />;

  if (error) {
    toastify({
      type: 'error',
      message: error.message,
    });
  } 

  return <Fragment>{children}</Fragment>;
};

export { AuthGuard };
