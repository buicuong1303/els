import { Logger } from '@nestjs/common';
// import { ApolloError } from 'apollo-server-express';

//TODO: pending migrate to Fastify
import { ApolloError } from 'apollo-server-fastify';

export class InternalServerError extends ApolloError {
  constructor(message: string, logger: Logger, error: any) {
    super(message, 'INTERNAL_SERVER_ERROR');
    logger.error(error);
    Object.defineProperty(this, 'name', { value: 'InternalServerError' });
  }
}
export class NotFoundError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'NOT_FOUND_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}

//TODO: Let note description for error
export class BadRequestError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'BAD_REQUEST_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'BadRequestError' });
  }
}

//TODO: Let note description for error
export class UnsupportedMediaTypeError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'UNSUPPORTED_MEDIATYPE_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'UnsupportedMediaTypeError' });
  }
}

//TODO: Let note description for error
export class ForbiddenError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'FORBIDDEN_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
  }
}

//TODO: Let note description for error
export class ConflictError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'CONFLICT_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'ConflictError' });
  }
}

//TODO: Let note description for error
export class MethodNotAllowedError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'METHOD_NOT_ALLOWED_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'MethodNotAllowedError' });
  }
}

//TODO: Let note description for error
export class RequestTimeoutError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'REQUEST_TIMEOUT_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'RequestTimeoutError' });
  }
}

//TODO: Let note description for error
export class UnauthorizedError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'UNAUTHORIZED_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'UnauthorizedError' });
  }
}

//TODO: Let note description for error
export class NotImplementedError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'NOT_IMPLEMENTED_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'NotImplementedError' });
  }
}

//TODO: Let note description for error
export class PayloadTooLargeError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'PAYLOAD_TOO_LARGE_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'PayloadTooLargeError' });
  }
}

//TODO: Let note description for error
export class ValidationError extends ApolloError {
  constructor(message: string, logger: Logger, error: any = null, properties?: { [key: string]: any }) {
    super(message, 'VALIDATION_ERROR', properties);
    logger.error(error || message);
    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}

//TODO: Let note description for error
//* only RateLimitError can skip logger
export class RateLimitError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'RATE_LIMIT_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'RateLimitError' });
  }
}
