import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountIdentity, User } from '@els/server/learning/user/data-access/entities';
import { UserService } from '@els/server/learning/user/data-access/services';
@Resolver(() => AccountIdentity)
export class AccountIdentityResolver {
  constructor(private readonly _userService: UserService) {}

  @ResolveField(() => User)
  public user(@Parent() accountIdentity: AccountIdentity) {
    return this._userService.findUserByIdentityId(accountIdentity.id);
  }
}
