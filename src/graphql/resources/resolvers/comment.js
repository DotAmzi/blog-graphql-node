export default {

    User: {

    },
    
    Query: {
      comments: (parent, { first = 10, offset = 0 }, {db}, info) => {
        return db.posts
          .findAll({
            order: [[ 'id', 'DESC' ]],
            limit: first,
            offset: offset
          });
      },
  
      comment: (parent, {id}, {db}, info) => {
        return db.comments
          .findByPk(id)
          .then(comment => {
            if (!comment) throw new Error('Comment not found');
            return comment;
          });
      }
  
    },
  
    Mutation: {
      createComment: (parent, {input}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.comments
            .findOne({where: 
              {
                comment: input.comment
              }
            })
            .then(comment => {
              if (comment) throw new Error(`Comment with comment ${input.comment} has been created!`);
              return db.comments
                .create(input, {transaction: t});
            });
        });
      },
  
      updateComment: (parent, {input, id}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.comments.findByPk(id)
            .then(comment => {
              if (!comment) throw new Error(`Comment with id ${id} not exist!`);
              return comment.update(input, {t});
            });
        });
      }
  
    }
    
    };