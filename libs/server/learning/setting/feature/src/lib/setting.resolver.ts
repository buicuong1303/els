import { Setting } from '@els/server/learning/setting/data-access/entities';
import { SettingService } from '@els/server/learning/setting/data-access/services';
import { SettingMutations } from '@els/server/learning/setting/data-access/types';
import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly _settingService: SettingService) {}

  @Mutation(() => SettingMutations, { name: 'settings', nullable: true })
  settingMutations() {
    return {};
  }
}
