import {
  DateTimeResolver,
  DateResolver,
  TimeResolver,
  IPv4Resolver,
  JSONResolver,
  EmailAddressResolver,
  PhoneNumberResolver,
  URLResolver,
  ObjectIDResolver
} from 'graphql-scalars';
import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';

export const DateTimeScalar = createFromGraphQLScalar({
  scalar: DateTimeResolver,
  name: 'DateTimeScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => DateTimeType,
});

export class DateTimeType {};

export const DateScalar = createFromGraphQLScalar({
  scalar: DateResolver,
  name: 'DateScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => DateType,
});

export class DateType {};

export const TimeScalar = createFromGraphQLScalar({
  scalar: TimeResolver,
  name: 'TimeScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => TimeType,
});

export class TimeType {};

export const IPv4Scalar = createFromGraphQLScalar({
  scalar: IPv4Resolver,
  name: 'IPv4Scalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => IPv4Type,
});

export class IPv4Type {};

export const JSONScalar = createFromGraphQLScalar({
  scalar: JSONResolver,
  name: 'JSONScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => JSONType,
});

export class JSONType {};

export const EmailAddressScalar = createFromGraphQLScalar({
  scalar: EmailAddressResolver,
  name: 'EmailAddressScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => EmailAddressType,
});

export class EmailAddressType {};

export const PhoneNumberScalar = createFromGraphQLScalar({
  scalar: PhoneNumberResolver,
  name: 'PhoneNumberScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => PhoneNumberType,
});

export class PhoneNumberType {};

export const URLScalar = createFromGraphQLScalar({
  scalar: URLResolver,
  name: 'URLScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => URLType,
});

export class URLType {};

export const ObjectIDScalar = createFromGraphQLScalar({
  scalar: ObjectIDResolver,
  name: 'ObjectIDScalar',

  // The type that you would use with the `@Scalar` decorator.
  type: () => ObjectIDType,
});
export class ObjectIDType {}
