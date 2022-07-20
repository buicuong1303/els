import { Query, Resolver } from '@nestjs/graphql';
import { FormQueries } from '@els/server-guardian-form-data-access-types';

@Resolver()
export class FormResolver {
  @Query(() => FormQueries, {
    nullable: true,
    description: 'Root Query for all forms related queries',
    name: 'form',
  })
  formQueries(): FormQueries {
    return {};
  }
}
