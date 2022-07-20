/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { extractIntegerEnvVar } from '@els/shared/utils';
import { Injectable, Logger } from '@nestjs/common';
import * as MinIo from 'minio';

@Injectable()
export class MinIoService {
  private readonly _logger = new Logger(MinIoService.name);
  private _client;
  constructor() {
    let host: string = process.env.MINIO_HOST || 'https://minio.els.com'; // same with minio public to help for pre-sign url
    if (host.includes('http')) host = host.split('://')[1];
    this._client = new MinIo.Client({
      //* must be public host, not ip private
      endPoint:  host,
      port: extractIntegerEnvVar('MINIO_PORT'),
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER || 'minio',
      secretKey: process.env.MINIO_ROOT_PASSWORD || 'minio123',
    });
    const self = this._client;

    //* Make default bucket on minio to put resource
    const defaultBucket = process.env.MINIO_BUCKET_NAME || 'els';

    const logger = this._logger; //? Fix error An outer value of 'this' is shadowed by this container
    this._client.bucketExists(defaultBucket, function (err, exists) {
      if (err) {
        return logger.error(err + ' ' + host);
      }

      if (!exists) {
        self.makeBucket(
          defaultBucket,
          process.env.MINIO_REGION || 'vietnam',
          function (err: any) {
            if (err) return logger.log('Error creating bucket.', err);
            logger.log(
              `${defaultBucket} was created successfully in "vietnam".`
            );
          }
        );
      }
    });
  }

  async uploadFile(
    bucket: string,
    path: string,
    contentType: string,
    buffer: Buffer
  ): Promise<any> {
    const uploadPromise = (
      bucket: string,
      path: string,
      buffer: Buffer
    ) => {
      return new Promise((resolve, reject) => {
        this._client.putObject(
          bucket,
          path,
          buffer,
          buffer.toString().length,
          {
            'Content-Type': contentType,
          },
          function (err: any, etag: any) {
            if (err) return reject(err);
            resolve(etag);
          }
        );
      });
    };
    return uploadPromise(bucket, path, buffer);
  }

  async uploadFileDefinition(
    fileName: string,
    arrayBuffer: ArrayBuffer
  ): Promise<any> {
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    const uploadPromise = (
      bucket: string,
      fileName: string,
      buffer: Buffer
    ) => {
      return new Promise((resolve, reject) => {
        this._client.putObject(
          bucket,
          `reports/input-vocabulary/${fileName}`,
          buffer,
          buffer.toString().length,
          {
            'Content-Type':
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          function (err: any, etag: any) {
            if (err) return reject(err);
            resolve(etag);
          }
        );
      });
    };
    return uploadPromise(
      process.env.MINIO_BUCKET_NAME || '',
      fileName,
      buffer
    );
  }

  async getPresignedUrl(bucket: string, path: string) {
    const getPresignedUrlPromise = (
      bucket: string,
      path: string
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        this._client.presignedPutObject(
          bucket,
          path,
          24 * 60 * 60,
          function (err, presignedUrl) {
            if (err) return reject(err);
            return resolve(presignedUrl);
          }
        );
      });
    };
    const url = await  getPresignedUrlPromise(bucket, path);
    return url;
  }

  async getObject(bucket: string, path: string) {
    const getPresignedUrlPromise = (bucket: string, path: string) => {
      return new Promise((resolve, reject) => {
        this._client.getObject(
          bucket,
          path,
          async function (err, dataStream) {
            if (err) return reject(err);
            const chunks = [];
            for await (const chunk of dataStream) {
              chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            return resolve(buffer);
          }
        );
      });
    };
    return getPresignedUrlPromise(bucket, path);
  }

  async listObjects(bucket: string, prefix: string) {
    const data: any[] = [];
    const stream = this._client.listObjectsV2(bucket, prefix, true, prefix);

    for await (const chunk of stream) {
      data.push(chunk);
    }
    return data;
  }
}
