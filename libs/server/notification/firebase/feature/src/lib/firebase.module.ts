/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpModule } from '@els/server/notification/amqp';
import { FirebaseService } from '@els/server/notification/firebase/data-access/services';
import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Module({
  imports: [AmqpModule],
  controllers: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
    });
  }
}
