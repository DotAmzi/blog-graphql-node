import {GraphQLScalarType} from 'graphql';
import fs from 'fs';
import AWS from 'aws-sdk';
import env from 'dotenv';
env.config({load: '../../../'});

const Base64Type = new GraphQLScalarType({
  name: 'Base64',
  description: 'Type to base64 pic',
  parseValue: value => {
    if (value.indexOf(';base64') === -1) {
      throw new Error('This value is not a base64');
    }
    const returnValue = {};
    returnValue.hash = value.split(';base64,').pop();
    returnValue.type = value.split(';')[0];
    returnValue.type = returnValue.type.replace('data:', '');
    returnValue.ext = value.split(';')[0].split('/')[1];
    return returnValue;
  },
  serialize: serial => {
    const name = serial.split('/').reverse();
    let folderTemp = __dirname.replace('graphql/scalar-types', '');
    folderTemp += 'tmp-folder';
    var file = fs.createWriteStream(`${folderTemp}/${name[0]}`);

    if (serial.indexOf('s3.amazonaws') !== -1) {
      AWS.config.accessKeyId = process.env.AWS_S3_ACCESS_KEY;
      AWS.config.secretAccessKey = process.env.AWS_S3_SECRET;
      const s3 = new AWS.S3();
      var params = {
        Bucket: `9wall/${name[1]}`,
        Key: name[0]
      };
      s3.getObject(params).createReadStream().pipe(file);
    } else {
      fs.createReadStream(serial).pipe(file);
    }
    return `download/${name[0]}`;
  },
  parseLiteral: ast => {
    if (ast.value.indexOf(';base64') === -1) {
      throw new Error('This value is not a base64');
    }
    const returnValue = {};
    returnValue.hash = ast.value.split(';base64,').pop();
    returnValue.type = ast.value.split(';')[0];
    returnValue.type = returnValue.type.replace('data:', '');
    returnValue.ext = ast.value.split(';')[0].split('/')[1];
    return returnValue;
  }
});

export {
  Base64Type
};