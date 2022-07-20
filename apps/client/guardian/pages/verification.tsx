/* eslint-disable @typescript-eslint/no-empty-interface */
import { Verification as VerificationContainer } from '@els/client/guardian/feature/verification';
import { NextPageContext } from 'next';

export interface VerificationProps {}

export function Verification(props: VerificationProps) {
  return <VerificationContainer />;
}

Verification.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Verification;
