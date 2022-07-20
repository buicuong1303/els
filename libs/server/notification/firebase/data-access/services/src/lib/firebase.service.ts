/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  private readonly _logger = new Logger(FirebaseService.name);

  async sendToTopic(payload: any) {
    const { title, body, topic } = payload;
    if (topic)
      admin
        .messaging()
        .sendToTopic(topic, {
          data: {
            title,
            body,
          },
        })
        .then((response) => {
          this._logger.log(`Successfully sent message: ${JSON.stringify(response)}`);
        })
        .catch((error) => {
          this._logger.log(`Error sending message: ${JSON.stringify(error)}`);
        });
  }

  async sendToDevice(payload: any) {
    const { tokens, title, body } = payload;
    if (tokens && tokens.length > 0)
      admin
        .messaging()
        .sendToDevice(tokens, {
          data: {
            title,
            body,
          },
        })
        .then((response) => {
          if (response.failureCount > 0) {
            const failedTokens = [];
            response.results.forEach((resp, idx) => {
              if (resp.error) {
                if (Array.isArray(tokens)) failedTokens.push(tokens[idx]);
                else failedTokens.push(tokens);
              }
            });
            this._logger.log(`List of tokens that caused failures: ${JSON.stringify(failedTokens)}`);
          }
        })
        .catch((error) => {
          this._logger.log(`Error sending message: ${JSON.stringify(error)}`);
        });
  }

  //* Send messages to specific devices
  async send(token: string) {
    const message = {
      data: {
        score: '850',
        time: '2:45',
      },
      token: token,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        this._logger.log(`Successfully sent message: ${JSON.stringify(response)}`);
      })
      .catch((error) => {
        //TODO: remove token
        this._logger.log(`Error sending message: ${JSON.stringify(error)}`);
      });
  }
  //* Send messages to multiple devices
  // async sendMulticast(tokens: string[]) {
  //   const message = {
  //     data: { score: '850', time: '2:45' },
  //     tokens: tokens,
  //   };

  //   admin
  //     .messaging()
  //     .sendMulticast(message)
  //     .then((response) => {
  //       if (response.failureCount > 0) {
  //         const failedTokens = [];
  //         response.responses.forEach((resp, idx) => {
  //           if (!resp.success) {
  //             failedTokens.push(tokens[idx]);
  //           }
  //         });
  //         //TODO remove token
  //         console.log('List of tokens that caused failures: ' + failedTokens);
  //       }
  //     });
  // }

  // //* Send messages to topics
  // async sendByTopic() {
  //   const topic = 'highScores';

  //   const message = {
  //     data: {
  //       score: '850',
  //       time: '2:45',
  //     },
  //     topic: topic,
  //   };

  //   admin
  //     .messaging()
  //     .send(message)
  //     .then((response) => {
  //       console.log('Successfully sent message:', response);
  //     });
  // }

  // //* Send a batch of messages
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendAll(payload: any) {
    // Create a list containing up to 500 messages.
    const messages = [];
    messages.push({
      data: { title: 'Price drop', body: '5% off all electronics' },
      token: '',
    });
    messages.push({
      data: { title: 'Price drop', body: '2% off all books' },
      topic: 'readers-club',
    });

    admin
      .messaging()
      .sendAll(messages)
      .then((response) => {
        this._logger.log(`${response.successCount} messages were sent successfully!`);
      });
  }

  async unsubscribeFromTopic(tokens: string | string[], topicName: string) {
    admin
      .messaging()
      .unsubscribeFromTopic(tokens, topicName)
      .then((response) => {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        this._logger.log(`Successfully unsubscribed from topic: ${JSON.stringify(response)}`);
      })
      .catch((error) => {
        this._logger.log(`Error unsubscribing from topic: ${JSON.stringify(error)}`);
      });
  }

  async subscribeToTopic(tokens: string | string[], topicName: string) {
    admin
      .messaging()
      .subscribeToTopic(tokens, topicName)
      .then((response) => {
        // Response is a message ID string.
        this._logger.log(`Successfully subscribe: ${JSON.stringify(response)}`);
        // this._learningService.removeTokens([token]);
      })
      .catch((error) => {
        //TODO remove token
        this._logger.log(`Error sending message:: ${JSON.stringify(error)}`);
      });
  }
}
