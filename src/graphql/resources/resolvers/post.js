export default {

    Post: {
      user: (post, args, {db}, info) => {
        return db.users.findByPk(post.id_user);
      },

      tag: (post, args, {db}, info) => {
        return db.tags.findByPk(post.id_tag);
      },

      comments: (post, args, {db}, info) => {
        return db.comments.findAll({
          where:{
            id_post: post.id
          }
        });
      }
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
          return db.tags
            .findByPk(input.id_tag)
            .then(tag => {
              if (!tag) throw new Error(`Tag with id ${input.id_tag} has not been created!`);
              return db.posts
                .findOne({where: 
                  {
                    title: input.title
                  }
                });
            })
            .then(post => {
              if (post) throw new Error(`Post with title ${input.title} has been created!`);
              return db.posts
                .create(input, {transaction: t});
            });
        });
      },
  
      updatePost: (parent, {input, id}, {db, user}, info) => {
        const titleValue = input.title ? input.title : null;
        const Op = db.Sequelize.Op;
        return db.sequelize.transaction((t) => {
          return db.posts.findOne({
            where: {
              title: titleValue,
              id: {
                [Op.ne]: id
              }
            }
          })
          .then(existValue => {
            if (existValue) throw new Error(`Title registred on another post!`);
            return db.posts.findByPk(id);
          })
          .then(post => {
            if (!post) throw new Error(`Post with id ${id} not exist!`);
            input.id_tag = input.id_tag ? input.id_tag : post.id_tag;
            return db.tags.findByPk(input.id_tag)
              .then(tag => {
                return {
                  post, tag
                }
              });
          })
          .then(postTag => {
            if (!postTag.tag) throw new Error(`Tag with id ${input.id_tag} has not been created!`);
            return postTag.post.update(input, {t});
          });
        });
      }
  
    }
    
    };