/* eslint-disable @typescript-eslint/no-empty-interface */
import { RecoveryPassword as RecoverPasswordContainer } from '@els/client-guardian-feature-recover-password';

export interface RecoveryPasswordProps {}

export function RecoveryPassword(props: RecoveryPasswordProps) {
  return <RecoverPasswordContainer />;
}

export default RecoveryPassword;
