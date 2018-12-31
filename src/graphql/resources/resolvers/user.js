export default {

    User: {

    },
    
    Query: {
      users: (parent, { first = 10, offset = 0 }, {db}, info) => {
        return db.users
          .findAll({
            order: [[ 'id', 'DESC' ]],
            where: {
              'active': 'enabled'
            },
            limit: first,
            offset: offset
          });
      },
  
      user: (parent, {id}, {db}, info) => {
        return db.users
          .findByPk(id)
          .then(user => {
            if (!user) throw new Error('User not found');
            return user;
          });
      },
  
      currentUser: (parent, args, {db, user}, info) => {
        return db.users
          .findByPk(user.id);
      }
  
    },
  
    Mutation: {
      createUser: (parent, {input}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.users
            .findOne({where: 
              {
                $or: [
                  {cpf: input.cpf},
                  {email: input.email}
                ]
              }
            })
            .then(user => {
              if (user) throw new Error('User with cpf or email has been created!');
              return db.users
                .create(input, {transaction: t});
            });
        });
      },
  
      updateUser: (parent, {input}, {db, user}, info) => {
        const cpf = input.cpf ? input.cpf : null;
        const email = input.email ? input.email : null;
  
        return db.sequelize.transaction((t) => {
          return db.users
            .findOne({
              where: {
                id: {
                  $ne: user.id
                },
                $or: [
                  {cpf},
                  {email}
                ]
              }
            })
            .then(userQuery => {
              if (userQuery) throw new Error('CPF or Email already registered');
              return db.users.findByPk(user.id);
            })
            .then(user => {
              return user.update(input, {t});
            });
        });
      },
  
      updateUserPassword: (parent, {password, confirmPassword, currentPassword}, {db, user}, info) => {
        if (password !== confirmPassword) throw new Error('New Password not equal confirm new Password');
        return db.sequelize.transaction((t) => {
          return db.users.findByPk(user.id)
            .then((user) => {
              let errorMessage = 'Current password or User invalid';
              if (!user || !db.users.prototype.isPassword(user.get('password'), currentPassword)) throw new Error(errorMessage);
              return user.update({'password': password}, {t})
                .then(userUpdate => !!userUpdate);
            });
        });
      }
  
    }
    
    };