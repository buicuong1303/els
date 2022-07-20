import { ResolveField, Resolver } from '@nestjs/graphql';
import { JSONObjectResolver } from 'graphql-scalars';
import { FormService } from '@els/server-guardian-form-data-access-services';
import { FormQueries } from '@els/server-guardian-form-data-access-types';

@Resolver(() => FormQueries)
export class FormsQueriesResolver {
  constructor(private readonly _formService: FormService) {}

  @ResolveField(() => [JSONObjectResolver])
  async login(): Promise<any> {
    return await this._formService.loginSchema();
  }

  @ResolveField(() => [JSONObjectResolver])
  async registration(): Promise<any> {
    return await this._formService.registrationSchema();
  }
}
