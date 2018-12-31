export default `

  type Comment {
    id: ID!
  }

  input CommentCreateInput {
    comment: String!
    id_post: ID!
    id_user: ID!
  }

  input CommentUpdateInput {
    comment: String!
    id_post: ID!
    id_user: ID!
  }

  type Query {
    # Get all comments
    comments(first: Int, offset: Int): [ Comment! ]!
    # Get single comment
    comment(id: ID!): Comment
  }

  type Mutation {
    # Create Comment
    createComment(input: CommentCreateInput!): Comment!
    # Update Comment Account
    updateComment(input: CommentUpdateInput!, id: ID!): Comment!
  }
`;