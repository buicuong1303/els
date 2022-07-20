import {
  Args,
  ComplexityEstimatorArgs,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User, AccountIdentity } from '@els/server/learning/user/data-access/entities';
import {
  UserMutations,
} from '@els/server/learning/user/data-access/types';
import { UserService } from '@els/server/learning/user/data-access/services';
import { Enrollment, SummaryMemoryStatus } from '@els/server/learning/enrollment/data-access/entities';
import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
import { WordbookService } from '@els/server/learning/wordbook/data-access/services';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { AuthGuard, Permission, PermissionsGuard, Permissions, Auth, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { SettingService } from '@els/server/learning/setting/data-access/services';
import { JSONType } from '@els/server/shared';
import { AssignedMission } from '@els/server/learning/common';
@Resolver(() => User)
@UseGuards(PermissionsGuard)
export class UserResolver {
  constructor(
    private readonly _userService: UserService,
    private readonly _settingService: SettingService,
    private readonly _enrollmentService: EnrollmentService,
    private readonly _wordbookService: WordbookService
  ) {}

  @Mutation(() => UserMutations, { nullable: true, name: 'user' })
  @UseGuards(AuthGuard)
  userMutations() {
    return {};
  }

  @Query(() => User)
  @Permissions(Permission.GET_USER)
  @UseGuards(AuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async user(@Auth() identity: Identity, @Args('inviterId', {nullable: true}) inviterId: string) {
    return this._userService.getInfoUser(identity);
  }
  
  @Query(() => [AssignedMission], {name: 'attendanceUser'})
  @UseGuards(AuthGuard)
  async userAttendance(@Auth() identity: Identity) {
    return this._userService.getUserAttendance(identity);
  }

  @Query(() => [User], {name: 'usersAcceptInvitation'})
  @UseGuards(AuthGuard)
  async getUserAcceptInvitation(@Auth() identity: Identity) {
    return this._userService.getUserAcceptInvitation(identity);
  }

  @ResolveField(() => [Enrollment], {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async enrollments(@Parent() user: User) {
    return this._enrollmentService.findByUserId(user.id);
  }

  @ResolveField(() => [Wordbook], {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async wordbooks(@Parent() user: User) {
    return this._wordbookService.findWordBookByUserId(user.id);
  }

  @ResolveField(() => AccountIdentity)
  @Permissions(Permission.GET_USER)
  identity(@Parent() user: User): any {
    return { __typename: 'AccountIdentity', id: user.identityId };
  }

  @ResolveField(() => JSONType, { nullable: true })
  setting(@Parent() user: User) {
    return this._settingService.getSetting(user.id);
  }

  @ResolveField(() => SummaryMemoryStatus, { nullable: true })
  summaryMemoryStatus(@Parent() user: User) {
    return this._enrollmentService.mySummaryMemoryStatus(user.id);
  }

  @ResolveField(() => [MemoryAnalysis], { nullable: true })
  memoryAnalyses(@Parent() user: User) {
    return this._enrollmentService.memoryAnalysis(user.id);
  }
}
