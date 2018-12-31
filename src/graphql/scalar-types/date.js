import {GraphQLScalarType} from 'graphql';

const dateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Type to date',
  parseValue: value => {
    return value;
  },
  serialize: serial => {
    serial = new Date(serial);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];

    let returnValue = serial.getHours();
    returnValue += ':' + serial.getMinutes();
    returnValue += ':' + serial.getSeconds();
    returnValue += ' ' + serial.getDate();
    returnValue += '/' + months[serial.getMonth()];
    returnValue += '/' + serial.getFullYear();
    return returnValue;
  },
  parseLiteral: ast => {
    return ast.value;
  }
});

export {
  dateType
};