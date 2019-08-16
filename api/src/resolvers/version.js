import { UserInputError } from 'apollo-server-express'

export default {
  Query: {
    getVersion: async (root, { user, reportId, transactionId }, { network, models }, info) => {
      const version = await models.Version.findOne({ report: reportId, transactionId: transactionId })
      if (!version) {
        throw new UserInputError('There is no such report.')
      }
      let networkResult = null
      if(version.type === 'init') {
        networkResult = await network.getReportCreationTransaction(user.passport, reportId) 
        if (networkResult.error != null) {
          throw new UserInputError(networkResult.error)
        } 
      } else {
        networkResult = await network.getReportUpdatingTransaction(user.passport, transactionId) 
        if (networkResult.error != null) {
          throw new UserInputError(networkResult.error)
        }
      }
      version.text = networkResult.text
      return version
    },
    getVersions: async (root, { reportId, page, limit, order }, { models }, info) => {
      return await models.Version.paginate({ report: reportId }, { page: page, limit: limit, sort: { createdAt: order} })
    }
  },
  Mutation: {
    updateReport: async (root, { user, reportId, text }, { network, models }, info) => {
      const report = await models.Report.findById(reportId)
      if (!report) {
        throw new UserInputError('There is no such report.')
      } 
      const networkResult = await network.updateReport(user.passport, reportId, text)
      if (networkResult.error != null) {
        throw new UserInputError(networkResult.error)
      }
      const { transactionId, newIpfsHash } = networkResult
      report.transactionId = transactionId
      report.ipfsHash = newIpfsHash
      report.versionsCount += 1
      await report.save()
      const version = await models.Version.create({ report: reportId, transactionId, ipfsHash: newIpfsHash })
      version.text = text
      return version
    }
  }
}
