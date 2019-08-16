import { gql } from 'apollo-server-express'

export default gql`

  # extend type Subscription {
  #   newDocumentsCount: Count! @auth
  # }

  # type Count {
  #   count: Int!
  # }

  extend type Query {
    getReport(reportId: String!): Report! @auth,
    getInitialReport(reportId: String!): Report! @auth,
    getReports(string: String!, page: Int!, limit: Int!, order: String!): PaginatedReports! @auth,
    getMyReports(page: Int!, limit: Int!, order: String!): PaginatedReports! @auth,
    getUserReports(id: String!, page: Int!, limit: Int!, order: String!): PaginatedReports! @auth,
  }

  extend type Mutation {
    createReport(text: String!, type: String!): Report! @auth,
    updateReport(reportId: String!, text: String!): Report! @auth
  }

  type PaginatedReports {
    docs: [Report!],
    totalDocs: Int!,
    page: Int!,
    limit: Int!
  }

  type Report {
    id: String!,
    text: String!,
    type: String!,
    author: Author!,
    transactionId: String!,
    ipfsHash: String!,
    versionsCount: Int!,
    createdAt: String!,
    updatedAt: String!
  }

  type Author {
    id: String!,
    role: String!,
    firstName: String!,
    lastName: String!
  }
`
