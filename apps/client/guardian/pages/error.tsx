/* eslint-disable @typescript-eslint/no-empty-interface */
import { Error as ErrorContainer } from '@els/client/guardian/feature/error';
import { NextPageContext } from 'next';

export interface ErrorProps {}

export function Error(props: ErrorProps) {
  return <ErrorContainer />;
}

Error.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Error;
