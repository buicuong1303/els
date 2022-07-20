import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

// })
export class StreakService {
  private readonly _logger = new Logger(StreakService.name);
  constructor(private readonly _connection: Connection) {};

}
