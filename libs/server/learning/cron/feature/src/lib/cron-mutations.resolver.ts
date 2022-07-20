/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CronService } from '@els/server/learning/cron/data-access/services';
import { CronMutations } from '@els/server/learning/cron/data-access/types';
import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => CronMutations)
export class CronMutationsResolver {
  constructor(private readonly _cronService: CronService) {}

  @ResolveField(() => String, { nullable: true})
  calcMemoryAnalysis() {
    return this._cronService.handleCalcMemoryAnalysis();
  }

  @ResolveField(() => String, { nullable: true})
  reduceLevelMemoryAnalysis() {
    return this._cronService.handleReduceLevelActualSkill();
  }

  @ResolveField(() => String, { nullable: true})
  handleCreateActualSkillHistory() {
    return this._cronService.handleCreateActualSkillHistory();
  }

  //* assign daily, weekly mission i
  @ResolveField(() => String, { nullable: true})
  handleAssignMission() {
    return this._cronService.handleAssignMission();
  }

  //* check if streak list is interrupted
  @ResolveField(() => String, { nullable: true})
  handleInactiveStreakList() {
    return this._cronService.handleInactivateStreakList();
  }

  @ResolveField(() => String, { nullable: true})
  handleRemindPracticeMorning() {
    return this._cronService.handleRemindPracticeMorning();
  }


  @ResolveField(() => String, { nullable: true})
  handleRemindPracticeAfternoon() {
    return this._cronService.handleRemindPracticeAfternoon();
  }

  @ResolveField(() => String, { nullable: true})
  handleRemindPracticeEvening() {
    return this._cronService.handleRemindPracticeEvening();
  }

  @ResolveField(() => String, { nullable: true})
  handleRemindPracticeMidnight() {
    return this._cronService.handleRemindPracticeMidnight();
  }

  @ResolveField(() => String, { nullable: true})
  handleRemindComeBack() {
    return this._cronService.handleRemindComeBack();
  }

  @ResolveField(() => String, { nullable: true})
  handleComplain1() {
    return this._cronService.handleComplain1();
  }

  @ResolveField(() => String, { nullable: true})
  handleUpdateRank() {
    return this._cronService.handleUpdateRank();
  }

  @ResolveField(() => String, { nullable: true})
  handleResetExpDate() {
    return this._cronService.handleResetExpDate();
  }
}