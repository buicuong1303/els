import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSettingAppInput {
  @Field({nullable: true})
  fromLang?: string;

  @Field({nullable: true})
  learningLang?: string;

  @Field({nullable: true})
  speak?: boolean;

  @Field({nullable: true})
  listen?: boolean;

  @Field({nullable: true})
  notification?: boolean;

  @Field({nullable: true})
  sound?: boolean;
}

@InputType()
export class UpdateSettingTargetInput {
  @Field()
  learnNew!: number;

  @Field()
  reviewForgot!: number;

  @Field()
  reviewVague!: number;

  @Field()
  exp?: number;
}
