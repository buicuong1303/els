import { registerEnumType } from '@nestjs/graphql';
export enum AllowedLevel {
  DIRECTOR = 'director',
  MANAGER = 'manager',
  LEADER = 'leader',
}
registerEnumType(AllowedLevel, {
  name: 'AllowedLevel',
});
