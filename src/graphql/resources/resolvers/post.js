export default {

    User: {

    },
    
    Query: {
      posts: (parent, { first = 10, offset = 0 }, {db}, info) => {
        return db.posts
          .findAll({
            order: [[ 'id', 'DESC' ]],
            limit: first,
            offset: offset
          });
      },
  
      post: (parent, {id}, {db}, info) => {
        return db.posts
          .findByPk(id)
          .then(post => {
            if (!post) throw new Error('Post not found');
            return post;
          });
      }
  
    },
  
    Mutation: {
      createPost: (parent, {input}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.posts
            .findOne({where: 
              {
                title: input.title
              }
            })
            .then(post => {
              if (post) throw new Error(`Post with title ${input.title} has been created!`);
              return db.posts
                .create(input, {transaction: t});
            });
        });
      },
  
      updatePost: (parent, {input, id}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.posts.findByPk(id)
            .then(post => {
              if (!post) throw new Error(`Post with id ${id} not exist!`);
              return post.update(input, {t});
            });
        });
      }
  
    }
    
    };