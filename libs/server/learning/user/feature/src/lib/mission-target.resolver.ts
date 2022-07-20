import {
  Enrollment
} from '@els/server/learning/enrollment/data-access/entities';
import { Mission } from '@els/server/learning/mission/data-access/entities';
import {
  MissionTarget
} from '@els/server/learning/user/data-access/entities';
import {
  ComplexityEstimatorArgs,
  Context, Parent, ResolveField, Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => MissionTarget)
export class MissionTargetResolver {
  @ResolveField(() => Enrollment, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async student(
  @Parent() missionTarget: MissionTarget,
    @Context('enrollmentsLoader') enrollmentsLoader: DataLoader<string, Enrollment>
  ) {
    if (missionTarget.studentId) {
      return enrollmentsLoader.load(missionTarget.studentId);
    }
  }

  @ResolveField(() => Enrollment, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async mission(
  @Parent() missionTarget: MissionTarget,
    @Context('missionsLoader') missionsLoader: DataLoader<string, Mission>
  ) {
    if (missionTarget.missionId) {
      return missionsLoader.load(missionTarget.missionId);
    }
  }
}
