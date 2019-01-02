export default `

  type User {
    id: ID!
    name: String!
    email: Email!
    password: String!
    photo: String!
    posts: [Post!]
    comments: [Comment!]
  }


  input UserCreateInput {
    name: String!
    email: Email!
    password: String!
    photo: String
  }

  input UserUpdateInput {
    name: String
    email: Email
    password: String
    photo: String
  }

  type Query {
    # Get all users
    users(first: Int, offset: Int): [ User! ]!
    # Get single user
    user(id: ID!): User
    # Get current user data
    currentUser: User
  }

  type Mutation {
    # Create User
    createUser(input: UserCreateInput!): User
    # Update User Account
    updateUser(input: UserUpdateInput!): User
    # Update user password to user logged
    updateUserPassword(password: String!, confirmPassword: String!, currentPassword: String!): Boolean
  }
`;