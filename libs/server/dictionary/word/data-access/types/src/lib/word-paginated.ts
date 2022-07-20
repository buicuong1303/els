import { ObjectType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
import { Word } from '@els/server/dictionary/word/data-access/entities';

@ObjectType()
export class PaginatedWord extends pagination.offset.Paginated(Word) {}
