import { BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';


export enum AssignedMissionStatus {
  COMPLETED = 'completed',
  INCOMPLETE = 'incomplete',
  PENDING = 'pending',
  DONE = 'done',
  IN_PROGRESS = 'in_progress',
}
@ObjectType({
  implements: () => [BaseType],
})
export class Mission extends BaseType {
  @Field()
  currentProgress!: number;

  @Field({ nullable: true })
  completedAt?: string;

  @Field({ nullable: true })
  assignedAt!: string;

  @Field()
  maxProgress!: number;

  @Field()
  expiredAt?: string | null;

  @Field()
  status!: AssignedMissionStatus;

  @Field({ nullable: true })
  userId?: string | null;

  @Field()
  missionId?: string | null;

  @Field()
  missionTargetId?: string | null;
};
