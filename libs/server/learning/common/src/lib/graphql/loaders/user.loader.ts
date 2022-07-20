/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { UserService } from '@els/server/learning/user/data-access/services';
import { User } from '@els/server/learning/user/data-access/entities';
export const createUsersLoader = (userService: UserService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct users
    const users: User[] = await userService.getUserByIds([...ids]);
    const usersMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => usersMap.get(id));
  });
};
