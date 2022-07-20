import { Setting } from '@els/server/learning/setting/data-access/entities';
import { SettingService } from '@els/server/learning/setting/data-access/services';
import { SettingMutations, UpdateSettingTargetInput, UpdateSettingAppInput } from '@els/server/learning/setting/data-access/types';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => SettingMutations)
export class SettingMutationsResolver {
  constructor(
    private readonly _settingService: SettingService
  ) {}

  @ResolveField(() => Setting)
  @UseGuards(AuthGuard)
  updateApp(@Args('updateSettingAppInput') updateSettingAppInput: UpdateSettingAppInput, @Auth() identity: Identity) {
    return this._settingService.updateAppSetting(updateSettingAppInput, identity);
  };

  @ResolveField(() => Setting)
  @UseGuards(AuthGuard)
  updateTarget(@Args('updateSettingTarget') updateSettingTarget: UpdateSettingTargetInput, @Auth() identity: Identity) {
    return this._settingService.updateTargetSetting(updateSettingTarget, identity);
  };
};
