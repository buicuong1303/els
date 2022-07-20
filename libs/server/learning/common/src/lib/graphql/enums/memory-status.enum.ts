import { registerEnumType } from '@nestjs/graphql';
export enum MemoryStatus {
  forgot = 'forgot',
  memorized = 'memorized',
  vague = 'vague',
  new = 'new'
}
registerEnumType(MemoryStatus, {
  name: 'MemoryStatus',
});

export enum UnTrackingMode {
  system = 'system',
  topic = 'topic',
}
registerEnumType(UnTrackingMode, {
  name: 'UnTrackingMode',
});