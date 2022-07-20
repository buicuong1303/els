import { Module } from '@nestjs/common';
import { FormsQueriesResolver } from './form-queries.resolver';
import { FormService } from '@els/server-guardian-form-data-access-services';
import { FormResolver } from './form.resolver';
import { KratosModule } from '@els/server/guardian/common';

@Module({
  imports: [
    KratosModule
  ],
  providers: [
    FormResolver,
    FormsQueriesResolver,
    FormService,
  ],
  exports: [FormService],
})
export class FormModule {}
