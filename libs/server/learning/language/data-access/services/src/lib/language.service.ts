/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { BaseLang } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { Connection, In } from 'typeorm';
@Injectable()
export class LanguageService {
  private readonly _logger = new Logger(LanguageService.name);
  constructor(
    private readonly connection: Connection
  ) {}
  
  async getLanguagesByIds(languageIds: string[]) {
    return this.connection.getRepository(BaseLang).find({
      where: {
        id: In(languageIds)
      }
    });
  }
}
