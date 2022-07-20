import { Sample } from '@els/server/dictionary/sample/data-access/entities';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SampleService {
  private readonly _logger = new Logger(SampleService.name);
  getSample(id: string): Sample {
    return {
      id: id,
      createdAt: new Date(),
      name: 'create',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
  }

  getSamples(): Sample[] {
    return [];
  }

  createSample(): Sample {
    const sample = {
      id: 'id',
      createdAt: new Date(),
      name: 'create',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
    return sample;
  }

  updateSample(): Sample {
    const sample = {
      id: 'id',
      createdAt: new Date(),
      name: 'update',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
    return sample;
  }

  deleteSample(id: string): Sample {
    return {
      id: id,
      createdAt: new Date(),
      name: 'update',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
  }
}
