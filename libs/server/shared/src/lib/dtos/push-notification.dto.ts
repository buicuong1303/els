import { PushMode } from '../enums/push-mode.enum';

interface Payload {
  title: string;
  body: string;
  topic?: string;
  tokens?: string | string[];
  metadata?: any;
}

export class PushNotificationDto {
  mode!: PushMode;
  payload!: Payload;
}
