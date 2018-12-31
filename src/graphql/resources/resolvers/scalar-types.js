import { GraphQLResolveInfo } from 'graphql';
import { doubleType } from '../../scalar-types/double';
import { dateType } from '../../scalar-types/date';
import { Base64Type } from '../../scalar-types/base64';
import { BigIntType } from '../../scalar-types/bigInt';
import { EmailType } from '../../scalar-types/email';

export default {
  Double: doubleType,
  Date: dateType,
  Base64: Base64Type,
  BigInt: BigIntType,
  Email: EmailType
};