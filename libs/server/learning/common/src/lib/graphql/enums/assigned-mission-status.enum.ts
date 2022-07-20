import { registerEnumType } from '@nestjs/graphql';

export enum AssignedMissionStatus {
  completed = 'completed',
  incomplete = 'incomplete',
  pending = 'pending',
  done = 'done',
  in_progress = 'in_progress',
}
registerEnumType(AssignedMissionStatus, {
  name: 'AssignedMissionStatus',
});