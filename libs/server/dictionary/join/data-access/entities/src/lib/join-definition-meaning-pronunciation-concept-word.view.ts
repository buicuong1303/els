/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ViewEntity, ViewColumn } from 'typeorm';
@ViewEntity({
  expression: `
  SELECT "join"."id" AS "id", "concept"."id" AS "conceptId", "definition"."id" AS "definitionId", "word"."id" AS "wordId" FROM "join" 
  LEFT JOIN "concept" "concept" ON "join"."conceptId" = "concept"."id"
  LEFT JOIN "definition" "definition" ON "join"."definitionId" = "definition"."id"
  LEFT JOIN "meaning" "meaning" ON "definition"."meaningId" = "meaning"."id"
  LEFT JOIN "word" "word" ON "meaning"."wordId" = "word"."id"
  `,
  materialized: true,

})
export class JoinDefinitionConceptMeaningPronunciationWord {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  definitionId!: string;

  @ViewColumn()
  conceptId!: string;

  @ViewColumn()
  wordId!: string;
}