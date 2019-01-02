export default {

    Comment: {
      user: (comment, args, {db}, info) => {
        return db.users.findByPk(comment.id_user);
      },

      post: (comment, args, {db}, info) => {
        return db.posts.findByPk(comment.id_post);
      }
    },
    
    Query: {
      comments: (parent, { first = 10, offset = 0 }, {db}, info) => {
        return db.comments
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
        input.id_user = user.id;
        return db.sequelize.transaction((t) => {
          return db.comments
            .findOne({where: 
              {
                comment: input.comment
              }
            })
            .then(comment => {
              if (comment) throw new Error(`Comment with comment ${input.comment} has been created!`);
              return db.posts.findByPk(input.id_post);
            })
            .then(post => {
              if (!post) throw new Error(`Post with id ${input.id_post} not exist!`);
              return db.comments
                .create(input, {transaction: t});
            });
        });
      },
  
      updateComment: (parent, {input, id}, {db, user}, info) => {
        const commentInput = input.comment ? input.comment : null;
        const Op = db.Sequelize.Op;
        return db.sequelize.transaction((t) => {
          return db.comments.findOne({
            where: {
              comment: commentInput,
              id: {
                [Op.ne]: id
              }
            }
          })
          .then(otherComment => {
            if (otherComment) throw new Error(`Comment has been regitred!`);
            return db.comments.findByPk(id);
          })
          .then(comment => {
            if (!comment) throw new Error(`Comment with id ${id} not exist!`);
            return comment.update(input, {t});
          });
        });
      }
  
    }
    
    };