import { GraphQLScalarType } from 'graphql';

export const doubleType = new GraphQLScalarType({
  name: 'Double',
  description: 'Type to double',
  parseValue: value => {
    if (value.indexOf('.') === -1) {
      throw new Error('This value is not a double');
    }
    return parseFloat(value.toString());
  },
  serialize: serial => {
    return parseFloat(serial.toString());
  },
  parseLiteral: ast => {
    if (ast.value.indexOf('.') === -1) {
      throw new Error('This value is not a double');
    }
    return parseFloat(ast.value.toString());
  }
});