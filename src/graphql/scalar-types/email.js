import {GraphQLScalarType} from 'graphql';

const EmailType = new GraphQLScalarType({
  name: 'Email',
  description: 'Type to email',
  parseValue: value => {
    if (value.indexOf('@') === -1 || value.indexOf('.') === -1) {
      throw new Error('This value is not a email');
    }
    return value;
  },
  serialize: serial => {
    return serial;
  },
  parseLiteral: ast => {
    if (ast.value.indexOf('@') === -1 || ast.value.indexOf('.') === -1) {
      throw new Error('This value is not a email');
    }
    return ast.value;
  }
});

export {
  EmailType
};