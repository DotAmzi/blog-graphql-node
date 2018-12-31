export default `

  type Post {
    id: ID!
    title: String!
    text: String!
    photo: String!
  }

  input PostCreateInput {
    title: String!
    text: String!
    photo: String!
  }

  input PostUpdateInput {
    title: String
    text: String
    photo: String
  }

  type Query {
    # Get all posts
    posts(first: Int, offset: Int): [ Post! ]!
    # Get single post
    post(id: ID!): Post
  }

  type Mutation {
    # Create Tag
    createPost(input: PostCreateInput!): Post
    # Update Post Account
    updatePost(input: PostUpdateInput!, id: ID!): Post
  }
`;