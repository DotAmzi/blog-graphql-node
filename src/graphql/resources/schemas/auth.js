export default `

  type Token {
    token: String!
    email: Email!
    id: Int!
  }

  type Mutation {
    # Create Token to login
    createToken(email: Email!, password: String!): Token!
  }

`;