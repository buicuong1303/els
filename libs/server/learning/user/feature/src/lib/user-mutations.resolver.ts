import { User } from '@els/server/learning/user/data-access/entities';
import { UserService } from '@els/server/learning/user/data-access/services';
import { CreateUserInput, RemoveWordInput, UserMutations } from '@els/server/learning/user/data-access/types';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => UserMutations)
export class UserMutationsResolver {
  constructor(
    private readonly _userService: UserService,
  ) {}
  @ResolveField(() => User)
  removeWordFromIgnoreList(
  @Args('removeWordInput') removeWordInput: RemoveWordInput
  ) {
    return this._userService.removeWordFromIgnoreList(removeWordInput);
  }

  @ResolveField(() => User)
  create(@Args('createUserInput') createUserInput: CreateUserInput){
    return this._userService.createUser(createUserInput);
  }

  @ResolveField(() => User)
  @UseGuards(AuthGuard)
  update(@Auth() identity: Identity){
    return this._userService.updateUser(identity);
  }

  @ResolveField(() => String, { nullable: true})
  @UseGuards(AuthGuard)
  checkIn(@Auth() identity: Identity){
    return this._userService.checkIn(identity);
  }
}
