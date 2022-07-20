import { User } from '@els/server/learning/user/data-access/entities';
import { Connection } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { exceptions, Identity } from '@els/server/shared';
import { EmailResponse } from '@els/server/learning/invitation/data-access/types';
import * as moment from 'moment';
import { MissionQueueService } from '@els/server/learning/queues';

@Injectable()
export class InvitationService {
  private readonly _logger = new Logger(InvitationService.name);
  constructor(
    private readonly _connection: Connection,
    private readonly _missionQueueService: MissionQueueService
  ) {}

  public async encodeRegistrationUrl(identity: Identity) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();
    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);
    const url = process.env.GUARDIAN_URL;
    const stringBase64 = Buffer.from(user.id);
    const encodeString = stringBase64.toString('base64');
    const urlEncode = `${url}/login?inviter_id=${encodeString}`;
    return urlEncode;
  }

  public decodeRegistrationUrl(encodeString?: string) {
    if(encodeString){
      const enStringBase64 = Buffer.from(encodeString, 'base64');
      const decodeString = enStringBase64.toString();
      return decodeString;
    }
    return '';
  }

  async emailInviter(identity: Identity) {
    const dataRes = new EmailResponse();
    const registrationUrl = await this.encodeRegistrationUrl(identity);
    dataRes.body = `You has a invitation to: ${registrationUrl}`;
    dataRes.subject = 'Yummy English';
    return dataRes;
  }

  private _isUUID(id: string) {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
  }

  async acceptInvitation(identity: Identity, inviterId: string) {
    const infoUser = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', { identityId: identity.account?.id })
      .getOne();
    if(!infoUser) throw new exceptions.NotFoundError('Not found user', this._logger);
    const createTime = moment(infoUser.createdAt);
    const nowTime = moment().subtract(1, 'minutes');
    if(nowTime.isBefore(createTime)){
      const userIdEncode = this.decodeRegistrationUrl(inviterId);
      if (this._isUUID(userIdEncode)) {
        const userInvited = await this._connection
          .createQueryBuilder(User, 'user')
          .where('user.id = :userId', { userId: userIdEncode })
          .getOne();
        if(userInvited && userInvited.id !== infoUser.id){
          if (!infoUser.userInvited) {
            infoUser.userInvited = userInvited;
            await this._connection.manager.save(infoUser);
            this._missionQueueService.updateProgressInvitePersons(userIdEncode);
            identity.clearInviterId();
          }
        }
      }
    }

    return null;
  }

}
