/* eslint-disable @typescript-eslint/no-empty-interface */
import { Error404 as Error404Container } from '@els/client/app/status/feature/error-404';

export interface Error404Props {}

export function Error404(props: Error404Props) {
  return <Error404Container />;
}

export default Error404;