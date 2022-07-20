import {
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Reaction } from '@els/server/learning/comment/data-access/schemas';
import { UserService } from '@els/server/learning/user/data-access/services';
@Resolver(() => Reaction)
export class ReactionResolver {
  constructor(private readonly _userService: UserService) {}

  @ResolveField()
  async user(
  @Parent() reaction: Reaction,
  ) {
    return this._userService.findUserById(reaction.userId);
  }
}
