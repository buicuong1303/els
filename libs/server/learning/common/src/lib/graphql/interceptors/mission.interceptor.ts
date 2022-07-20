/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MissionInterceptor implements NestInterceptor {
  // async updateProgressMission(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context).getContext();

  // }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap(() => console.log('next'))
      );
  }
}