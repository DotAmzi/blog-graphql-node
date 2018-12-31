import {GraphQLScalarType} from 'graphql';

const BigIntType = new GraphQLScalarType({
  name: 'BigInt',
  description: 'Type to Big Int',
  parseValue: value => {
    let number = parseInt(value);
    if (number === 'NaN') {
      throw new Error('Value not compatible, please type number');
    }
    return number;
  },
  serialize: serial => {
    return serial;
  },
  parseLiteral: ast => {
    let number = parseInt(ast.value);
    if (number === 'NaN') {
      throw new Error('Value not compatible, please type number');
    }
    return number;
  }
});

export {
  BigIntType
};