import { Logger } from '@nestjs/common';
import { GUARDIAN } from '../protobuf';
import { IFastifyReply, IFastifyRequest } from '../request';

export class Identity {
  private _logger = new Logger(Identity.name);
  private _account?: GUARDIAN.AuthenticateResponse;

  constructor(private _req: IFastifyRequest, private _res: IFastifyReply) {}

  //* sessionToken = authToken(for application without browser) or idToken (token from cookie)
  get sessionCookie() {
    return this._getCookies();
  }

  get sessionToken() {
    return this._getSessionToken();
  }

  get sessionId() {
    if (this._getCookies()) return this._getCookies();

    return this._getSessionToken() ?? '';
  }

  get account() {
    return this._account;
  }

  public updateAccount(account: GUARDIAN.AuthenticateResponse) {
    this._account = account;
  }

  private _getCookies() {
    if (this._req.headers['set-cookie'] && this._req.headers['set-cookie']?.toString() !== 'undefined') {
      return this._req.headers['set-cookie'].toString();
    };

    return undefined;
  }

  private _getSessionToken() {
    if (this._req.cookies?.idToken) return this._req.cookies.idToken;

    const authToken = (this._req.headers['Authorization'] ??
      this._req.headers['authorization']) as string;

    if (authToken && authToken.startsWith('Bearer ')) {
      return authToken.substr(7, authToken.length);
    };

    return undefined;
  }

  async isService(): Promise<boolean> {
    return false;
  }

  forget(): void {
    this._res.clearCookie(
      'idToken',
      {
        secret: process.env.COOKIE_SECRET,
        domain: process.env.WILDCARD_DOMAIN,
        path: '/',
      }
    );
  }

  remember(sessionToken: string): void {
    this._res.setCookie(
      'idToken',
      sessionToken,
      {
        secret: process.env.COOKIE_SECRET,
        domain: process.env.WILDCARD_DOMAIN,
        path: '/',
        httpOnly: true,
      }
    );
  }

  clearInviterId(): void {
    this._res.clearCookie(
      'inviter_id',
      {
        secret: process.env.COOKIE_SECRET,
        domain: process.env.WILDCARD_DOMAIN,
        path: '/',
      }
    );
  }
}
