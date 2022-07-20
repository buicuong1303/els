/* eslint-disable @typescript-eslint/no-empty-interface */
import { Login as LoginContainer } from '@els/client-guardian-feature-login';
import { NextPageContext } from 'next';

export interface LoginProps {}

export function Login(props: LoginProps) {
  return <LoginContainer />;
}

Login.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Login;
