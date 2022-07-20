/* eslint-disable @typescript-eslint/no-empty-interface */
import { Error500 as Error500Container } from '@els/client/app/status/feature/error-500';

export interface Error500Props {}

export function Error500(props: Error500Props) {
  return <Error500Container />;
}

export default Error500;