import { Injectable, Logger } from '@nestjs/common';
import { KratosService } from '@els/server/guardian/common';
@Injectable()
export class FormService {
  private readonly _logger = new Logger(FormService.name);
  constructor(private readonly _kratos: KratosService) {}

  async loginSchema(): Promise<any> {
    return await this._kratos.getLoginSchema();
  }

  async registrationSchema(): Promise<any> {
    return await this._kratos.getRegistrationSchema();
  }
}
