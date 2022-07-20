import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class HttpErrorFilter implements GqlExceptionFilter {
  private readonly _logger = new Logger('ExceptionError');
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ctx = gqlHost.switchToHttp();
    if (
      ![
        'NOT_FOUND_ERROR',
        'BAD_REQUEST_ERROR',
        'UNSUPPORTED_MEDIATYPE_ERROR',
        'FORBIDDEN_ERROR',
        'CONFLICT_ERROR',
        'METHOD_NOT_ALLOWED_ERROR',
        'REQUEST_TIMEOUT_ERROR',
        'UNAUTHORIZED_ERROR',
        'NOT_IMPLEMENTED_ERROR',
        'PAYLOAD_TOO_LARGE_ERROR',
        'VALIDATION_ERROR',
      ].includes(exception.name)
    ) {
      this._logger.error(exception);
      exception.message = 'Internal server';
      return exception;
    }
    return exception;
  }
}
