import jwt from 'jsonwebtoken';
import db from '../db/models';

export const verifyToken = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    if (
      req.body.query.indexOf('createToken') === -1 &&
      req.body.query.indexOf('createUser') === -1
    ) {
      const token = req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : undefined;
      return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.statusMessage = "Token Invalid";
          res.status(401).end();
        };
        return db.users.findByPk(decoded.sub).then(user => {
          if (!user) {
            res.statusMessage = "User not found";
            res.status(404).end;
          };
          req.user = user.dataValues;
          return next();
        });
      });
    } else {
      return next();
    }
  } else {
    return db.users.findByPk(1)
      .then(user => {
        if (!user) return next();
        req.user = user.dataValues;
        return next();
      });
  }
};