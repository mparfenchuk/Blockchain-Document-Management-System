import { gql } from 'apollo-server-express'

export default gql`

  extend type Query {
    me: User! @auth,
    user(id: String!): User! @auth,
    users(string: String!, page: Int!, limit: Int!, order: String!): PaginatedUsers! @auth
  }

  extend type Mutation {
    login(passport: String!, password: String!): Token!,
    signUp(passport: String!, role: String!, password: String!, firstName: String!, lastName: String!): Token!
  }

  type PaginatedUsers {
    docs: [User!],
    totalDocs: Int!,
    page: Int!,
    limit: Int!
  }

  type User {
    id: String!,
    role: String!,
    firstName: String!,
    lastName: String!,
    reportsCount: Int!
    createdAt: String!
  }

  type Token {
    token: String!
  }
`
