import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function initializeApp(
  app: INestApplication,
  hostname: string,
  port: number | string,
  globalPrefix: string,

  protoPath?: string,
  packageName?: string,
  url?: string
) {
  if(!(!protoPath || !packageName || !url)) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: url,
        package: packageName,
        protoPath: protoPath
      },
    });
  }

  app.setGlobalPrefix(globalPrefix);
  await app.startAllMicroservicesAsync();

  await app.listen(port, hostname, () => {
    Logger.log(
      `🚀 Application is running on: ${hostname}:${port}/${globalPrefix}`
    );
  });
}
