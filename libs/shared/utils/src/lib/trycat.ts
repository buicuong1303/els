import { Logger } from '@nestjs/common';

export async function trycat<T>(promise: Promise<T>) {
  try {
    const data: T = await promise;
    return [data, null];
  } catch (e) {
    Logger.error(`Error occurred inside trycat: ${JSON.stringify(e)}`);

    return [null, e];
  }
}

