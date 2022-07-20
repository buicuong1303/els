/* eslint-disable @typescript-eslint/no-empty-interface */
import { ResetPassword as ResetPasswordContainer } from '@els/client-guardian-feature-reset-password';
import { NextPageContext } from 'next';

export interface ResetPasswordProps {}

export function ResetPassword(props: ResetPasswordProps) {
  return <ResetPasswordContainer />;
}

ResetPassword.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default ResetPassword;
