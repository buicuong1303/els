import { Term } from '@els/server/dictionary/term/data-access/entities';
import { TermService } from '@els/server/dictionary/term/data-access/services';
import {
  Resolver
} from '@nestjs/graphql';
  
@Resolver(() => Term)
export class TermResolver {
  constructor(
    private readonly _termService: TermService
  ) {};
};
  