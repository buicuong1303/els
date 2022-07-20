/* eslint-disable @typescript-eslint/no-empty-interface */
import { Error401 as Error401Container } from '@els/client/app/status/feature/error-401';

export interface Error401Props {}

export function Error401(props: Error401Props) {
  return <Error401Container />;
}

export default Error401;