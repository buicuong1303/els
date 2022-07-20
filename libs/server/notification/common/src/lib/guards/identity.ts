import { GUARDIAN } from '@els/server/shared';
import { Logger } from '@nestjs/common';

export class Identity {
  private _logger = new Logger(Identity.name);
  private _account?: GUARDIAN.AuthenticateResponse;

  constructor(private _req: any) {}

  get account() {
    return this._account;
  }

  public updateAccount(account: GUARDIAN.AuthenticateResponse) {
    this._account = account;
  }
}
