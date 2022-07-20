import { exceptions } from '@els/server/shared';
import {
  HttpException,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import {
  Configuration,
  V0alpha2Api,
  UiNode,
  MetadataApi,
  SubmitSelfServiceLoginFlowWithPasswordMethodBody,
  SubmitSelfServiceRegistrationFlowWithPasswordMethodBody,
  SubmitSelfServiceLogoutFlowWithoutBrowserBody,
  SubmitSelfServiceVerificationFlowWithLinkMethodBody,
} from '@ory/kratos-client';
import { axios } from '@els/server/shared';
import { AccountIdentity } from '../account.type';
import { trycat } from '@els/shared/utils';
import { AxiosResponse } from 'axios';

@Injectable()
export class KratosService implements OnModuleInit {
  private readonly _logger = new Logger(KratosService.name);

  private _kratosPublicAPI?: V0alpha2Api;
  private _kratosAdminAPI?: V0alpha2Api;
  private _metadata?: MetadataApi;

  public get public_api(): V0alpha2Api {
    if (!this._kratosPublicAPI)
      throw new Error('Kratos public API not initialized');
    return this._kratosPublicAPI;
  }

  public get admin_api(): V0alpha2Api {
    if (!this._kratosAdminAPI)
      throw new Error('Kratos admin API not initialized');
    return this._kratosAdminAPI;
  }

  public get metadata_api(): MetadataApi {
    if (!this._metadata) throw new Error('Kratos metadata API not initialized');
    return this._metadata as MetadataApi;
  }

  private init() {
    this._kratosPublicAPI = new V0alpha2Api(
      new Configuration({
        basePath: process.env.KRATOS_PUBLIC_URL,
      }),
      process.env.KRATOS_PUBLIC_URL,
      axios
    );

    this._kratosAdminAPI = new V0alpha2Api(
      new Configuration({
        basePath: process.env.KRATOS_ADMIN_URL,
      }),
      process.env.KRATOS_ADMIN_URL,
      axios
    );

    this._metadata = new MetadataApi(
      new Configuration({
        basePath: process.env.KRATOS_ADMIN_URL,
      }),
      process.env.KRATOS_ADMIN_URL,
      axios
    );
  }

  onModuleInit(): any {
    this.init();
  }

  async passwordLogin(
    identifier: string,
    password: string,
    options?: { csrfToken: string; withRefresh: boolean; flowOption: any }
  ) {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceLoginFlowWithoutBrowser(
          options?.withRefresh,
          options?.flowOption
        );

      // TODO: need validate input
      // for (const node of flow.ui.nodes) {
      //   console.log(node);
      // }
      const methodBody: SubmitSelfServiceLoginFlowWithPasswordMethodBody = {
        method: 'password',

        //? 2 properties is the same, kratos v0.9.0-alpha.3, need check
        password_identifier: identifier,
        identifier: identifier,

        password: password,
        csrf_token: options?.csrfToken,
      };

      const rsp = await this.public_api.submitSelfServiceLoginFlow(
        flow.id,
        methodBody,
        undefined
      );

      return rsp.data;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages.length > 0) {
        throw new exceptions.NotFoundError(
          e.response.data.ui.messages[0].text,
          this._logger,
          e
        );
      }
      throw e;
    }
  }

  async passwordRegistration(
    traits: Record<string, any>,
    password: string,
    options?: { csrfToken: string; flowOption: any }
  ) {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceRegistrationFlowWithoutBrowser(
          options?.flowOption
        );

      const methodBody: SubmitSelfServiceRegistrationFlowWithPasswordMethodBody =
        {
          method: 'password',
          password,
          csrf_token: options?.csrfToken,
          traits,
        };

      const rsp = await this.public_api.submitSelfServiceRegistrationFlow(
        flow.id,
        methodBody
      );

      return rsp.data;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new exceptions.ConflictError(
          e?.response?.data?.ui?.messages[0]?.text,
          this._logger,
          e
        );
      }

      throw new exceptions.InternalServerError(
        'Register error!',
        this._logger,
        e
      );
    }
  }

  async getRegistrationSchema(options?: any): Promise<UiNode[]> {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceRegistrationFlowWithoutBrowser(
          options
        );

      return flow.ui.nodes;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new exceptions.BadRequestError(
          e.response.data.ui.messages.messages[0]?.text,
          this._logger,
          e
        );
      }

      throw new exceptions.InternalServerError(
        'Get Register Schema error!',
        this._logger,
        e
      );
    }
  }

  async getLoginSchema(options?: any): Promise<UiNode[]> {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceLoginFlowWithoutBrowser(
          false,
          undefined,
          undefined,
          options
        );

      return flow.ui.nodes;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new exceptions.BadRequestError(
          e.response.data.ui.messages.messages[0]?.text,
          this._logger,
          e
        );
      }

      throw new exceptions.InternalServerError(
        'Get Login Schema error!',
        this._logger,
        e
      );
    }
  }

  async accountRecovery(
    email: string,
    token?: string,
    options?: { csrfToken: string; flowOption: any }
  ) {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceRecoveryFlowWithoutBrowser(
          options?.flowOption
        );

      const rsp = await this.public_api.submitSelfServiceRecoveryFlow(
        flow.id,
        {
          method: 'link',
          csrf_token: options?.csrfToken,
          email: email,
        },
        token,

      );

      return rsp.data;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new HttpException(e.response.data.ui.messages, 400);
      }

      throw new exceptions.InternalServerError(
        'Account Recovery error!',
        this._logger,
        e
      );
    }
  }

  async verifyAccount(
    email: string,
    token?: string,
    options?: { csrfToken: string; flowOption: any }
  ) {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceVerificationFlowWithoutBrowser(
          options?.flowOption
        );

      const methodBody: SubmitSelfServiceVerificationFlowWithLinkMethodBody = {
        method: 'link',
        csrf_token: options?.csrfToken,
        email: email,
      };

      const rsp = await this.public_api.submitSelfServiceVerificationFlow(
        flow.id,
        methodBody,
        token
      );

      return rsp.data;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new HttpException(e.response.data.ui.messages, 400);
      }

      throw new exceptions.InternalServerError(
        'Verify Account error!',
        this._logger,
        e
      );
    }
  }

  //TODO: need handle logout for oidc
  async logout(token: string) {
    try {
      const methodBody: SubmitSelfServiceLogoutFlowWithoutBrowserBody = {
        session_token: token,
      };

      const rsp =
        await this.public_api.submitSelfServiceLogoutFlowWithoutBrowser(
          methodBody
        );
      return rsp.data;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        throw new HttpException(e.response.data.ui.messages, 400);
      }

      throw new exceptions.InternalServerError(
        'Logout error!',
        this._logger,
        e
      );
    }
  }

  async health(): Promise<string> {
    try {
      const rsp = await this.metadata_api.isAlive();
      return rsp.data.status;
    } catch (e: any) {
      if (e?.response?.data?.ui?.messages) {
        const messages: string[] = [];
        const codes: string[] = [];
        e.response.data.ui.messages.map((message: any) => {
          messages.push(message.text);
          codes.push(message.id);
        });

        throw new exceptions.InternalServerError(
          messages.reduce((final, current) => final + '\n' + current, ''),
          this._logger,
          e.response.data.ui.messages
        );
      }
      throw e;
    }
  }

  async whoami(
    xSessionToken?: string,
    cookie?: string,
    options?: any
  ): Promise<AccountIdentity> {
    try {
      const rsp = await this.public_api.toSession(
        xSessionToken,
        cookie,
        options
      );
      return new AccountIdentity(
        rsp.data.identity,
        rsp.data.authentication_methods
      );
    } catch (e: any) {
      this._logger.error(JSON.stringify(e));

      if (e?.response?.data?.error) {
        const error = e?.response?.data?.error;
        throw new HttpException(error, error.code);
      }

      throw new exceptions.InternalServerError(
        'Whoami error!',
        this._logger,
        e
      );
    }
  }

  async updateProfile(
    xSessionToken?: string,
    traits?: any,
    options?: { csrfToken: string; flowOption: any }
  ): Promise<AccountIdentity> {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceSettingsFlowWithoutBrowser(
          xSessionToken,
          options?.flowOption
        );

      const rsp = await this.public_api.submitSelfServiceSettingsFlow(
        flow.id,
        {
          method: 'profile',
          csrf_token: options?.csrfToken,
          traits,
        },
        xSessionToken,

      );
      return new AccountIdentity(rsp.data.identity);
    } catch (e: any) {
      if (e?.response?.data?.error) {
        const error = e?.response?.data?.error;
        throw new HttpException(error.reason, error.code);
      }

      throw new exceptions.InternalServerError(
        'Update Profile error!',
        this._logger,
        e
      );
    }
  }

  async updatePassword(
    xSessionToken: string,
    password: string,
    options?: { csrfToken: string; flowOption: any }
  ): Promise<AccountIdentity> {
    try {
      const { data: flow } =
        await this.public_api.initializeSelfServiceSettingsFlowWithoutBrowser(
          xSessionToken,
          options?.flowOption
        );
      const rsp = await this.public_api.submitSelfServiceSettingsFlow(
        flow.id,
        {
          method: 'password',
          csrf_token: options?.csrfToken,
          password,
        },
        xSessionToken,

      );
      return new AccountIdentity(rsp.data.identity);
    } catch (e: any) {
      if (e?.response?.data?.error) {
        const error = e?.response?.data?.error;
        return error;
      }

      throw new exceptions.InternalServerError(
        'Update Password error!',
        this._logger,
        e
      );
    }
  }

  async getAccountInfo(id: string) {
    if (this._kratosAdminAPI) {
      const [data, error] = await trycat(
        this._kratosAdminAPI.adminGetIdentity(id)
      );

      if (!data) {
        throw new exceptions.InternalServerError(
          'Get Account Info error!',
          this._logger,
          error
        );
      }
      return new AccountIdentity((<AxiosResponse>data).data);
    }

    throw new exceptions.InternalServerError(
      'Get Account Info error!',
      this._logger,
      null
    );
  }

  async getAccountsInfo() {
    if (this._kratosAdminAPI) {
      const [data, error] = await trycat(
        this._kratosAdminAPI.adminListIdentities()
      );

      if (!data) {
        throw new exceptions.InternalServerError(
          'Get Account Info error!',
          this._logger,
          error
        );
      }
      const listAccountIdentity: [AccountIdentity] = (<AxiosResponse>(
        data
      )).data.map((item: any) => {
        return new AccountIdentity(item);
      });
      return listAccountIdentity;
    }

    throw new exceptions.InternalServerError(
      'Get Account Info error!',
      this._logger,
      null
    );
  }
}
