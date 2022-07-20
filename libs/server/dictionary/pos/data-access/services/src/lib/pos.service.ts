import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';


@Injectable()
export class PosService {
  private readonly _logger = new Logger(PosService.name);
  constructor(
    @InjectRepository(Pos)
    private readonly _posRepository: Repository<Pos>,
    private readonly _connection: Connection
  ) {}

  async findPos() {
    const pos = await this._posRepository
      .createQueryBuilder('pos')
      .leftJoinAndSelect('pos.meanings', 'meanings')
      .leftJoinAndSelect('meanings.word', 'word')
      .leftJoinAndSelect('word.lang', 'lang')
      .getMany();
    return pos;
  };
};
