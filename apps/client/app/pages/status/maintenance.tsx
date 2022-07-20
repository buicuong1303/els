/* eslint-disable @typescript-eslint/no-empty-interface */
import { Maintenance as MaintenanceContainer } from '@els/client/app/status/feature/maintenance';

export interface MaintenanceProps {}

export function Maintenance(props: MaintenanceProps) {
  return <MaintenanceContainer />;
}

export default Maintenance;