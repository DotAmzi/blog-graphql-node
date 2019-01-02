export default `

  type Comment {
    id: ID!
    comment: String!
    user: User!
    post: Post!
  }

  input CommentCreateInput {
    comment: String!
    id_post: ID!
  }

  input CommentUpdateInput {
    comment: String!
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