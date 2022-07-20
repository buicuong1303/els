import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

// })
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(private readonly _connection: Connection) {};

}
