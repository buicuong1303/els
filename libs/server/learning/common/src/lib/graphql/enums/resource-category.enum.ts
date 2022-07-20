import { registerEnumType } from '@nestjs/graphql';
export enum ResourceCategory {
  image = 'image',
  audio = 'audio',
  video = 'video',
  sentence = 'sentence',
}

registerEnumType(ResourceCategory, {
  name: 'ResourceCategory',
});
