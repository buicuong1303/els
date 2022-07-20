import { registerEnumType } from '@nestjs/graphql';
export enum Lang {
  vi = 'vi',
  en = 'en',
}
registerEnumType(Lang, {
  name: 'Lang',
});
