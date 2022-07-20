/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { Permission } from '../enums';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    return true;
    // if(!requiredPermissions) {
    //   return true
    // }


    // const ctx: GqlContext = GqlExecutionContext.create(context).getContext();
    // //TODO get user's permissions
    // return requiredPermissions.some((permission) => user.permissions?.includes(permission))
  }
}
