/* eslint-disable @typescript-eslint/no-empty-interface */
import { Register as RegisterContainer } from '@els/client-guardian-feature-register';
import { NextPageContext } from 'next';

export interface RegisterProps {}

export function Register(props: RegisterProps) {
  return <RegisterContainer />;
}

Register.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Register;
