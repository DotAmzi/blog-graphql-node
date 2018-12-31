export default {

    User: {

    },
    
    Query: {
      tags: (parent, { first = 10, offset = 0 }, {db}, info) => {
        return db.tags
          .findAll({
            order: [[ 'id', 'DESC' ]],
            limit: first,
            offset: offset
          });
      },
  
      tag: (parent, {id}, {db}, info) => {
        return db.tags
          .findByPk(id)
          .then(tag => {
            if (!tag) throw new Error('Tag not found');
            return tag;
          });
      }
  
    },
  
    Mutation: {
      createTag: (parent, {input}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.tags
            .findOne({where: 
              {
                name: input.name
              }
            })
            .then(tag => {
              if (tag) throw new Error(`Tag with name ${input.name} has been created!`);
              return db.tags
                .create(input, {transaction: t});
            });
        });
      },
  
      updateTag: (parent, {input, id}, {db, user}, info) => {
        return db.sequelize.transaction((t) => {
          return db.tags.findByPk(id)
            .then(tag => {
              if (!tag) throw new Error(`Tag with id ${id} not exist!`);
              return tag.update(input, {t});
            });
        });
      }
  
    }
    
    };