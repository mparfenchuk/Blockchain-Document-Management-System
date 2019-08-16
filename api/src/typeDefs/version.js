import { gql } from 'apollo-server-express'

export default gql`

  extend type Query {
    getVersion(reportId: String!, transactionId: String!): Version! @auth,
    getVersions(reportId: String!, page: Int!, limit: Int!, order: String!): PaginatedVersions! @auth
  }

  type PaginatedVersions {
    docs: [Version!],
    totalDocs: Int!,
    page: Int!,
    limit: Int!
  }

  type Version {
    id: String!,
    text: String!,
    transactionId: String!,
    ipfsHash: String!,
    createdAt: String!
  }
`
