export default `

  type Tag {
    id: ID!
    name: String!
    posts: [Post!]
  }

  input TagCreateInput {
    name: String!
  }

  input TagUpdateInput {
    name: String
  }

  type Query {
    # Get all tags
    tags(first: Int, offset: Int): [ Tag! ]!
    # Get single tag
    tag(id: ID!): Tag
  }

  type Mutation {
    # Create Tag
    createTag(input: TagCreateInput!): Tag
    # Update Tag Account
    updateTag(input: TagUpdateInput!, id: ID!): Tag
  }
`;