import * as jwt from 'jsonwebtoken';

export default {

  Mutation: {

    createToken: (parent, {email, password}, {db}, info) => {
      return db.users.findOne({
        where: {email}
      })
        .then(user => {
          let errorMessage = 'Unauthorized, wrong email or password!';
          if (!user || !db.users.prototype.isPassword(user.get('password'), password)) { throw new Error(errorMessage); }
          const payload = {sub: user.get('id')};

          return {
            token: jwt.sign(payload, process.env.JWT_SECRET),
            id: user.id,
            email: user.email
          };
        });
    }

  }

};