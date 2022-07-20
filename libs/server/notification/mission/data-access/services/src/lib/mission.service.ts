import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

// })
export class MissionService {
  private readonly _logger = new Logger(MissionService.name);
  constructor(private readonly _connection: Connection) {};

}
