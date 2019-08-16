import { UserInputError } from 'apollo-server-express'
import { PubSub } from 'apollo-server-express'

// const pubsub = new PubSub();
// const DOCUMENTS_COUNT = 'DOCUMENTS_COUNT';

export default {
  // Subscription: {
  //   newDocumentsCount: {
  //     // Additional event labels can be passed to asyncIterator creation
  //     subscribe: () => pubsub.asyncIterator([DOCUMENTS_COUNT]),
  //   },
  // },
  Query: {
    getReport: async (root, { user, reportId }, { network, models }, info) => {
      const report = await models.Report.findById(reportId).populate('author')
      if (!report) {
        throw new UserInputError('There is no such report.')
      }
      const networkResult = await network.getReport(user.passport, reportId)
      if (networkResult.error != null) {
        throw new UserInputError(networkResult.error)
      }
      report.text = networkResult.text
      return report
    },
    getReports: async (root, { string, page, limit, order }, { models }, info) => {
      return await models.Report.paginate({ 'transactionId' : { '$regex' : string, '$options' : 'i' }}, { populate: 'author', page: page, limit: limit, sort: { createdAt: order} }) 
    },
    getMyReports: async (root, { user, page, limit, order }, { models }, info) => {
      return await models.Report.paginate({ author: user.id }, { page: page, limit: limit, sort: { createdAt: order} })
    },
    getUserReports: async (root, { id, page, limit, order }, { models }, info) => {
      return await models.Report.paginate({ author: id }, { page: page, limit: limit, sort: { createdAt: order} })
    },
  },
  Mutation: {
    createReport: async (root, { user, text, type }, { network, models }, info) => {
      const report = await models.Report.create({ author: user.id, type })
      const networkResult = await network.createReport(user.passport, user.id, report.id, text)
      if (networkResult.error != null) {
        throw new UserInputError(networkResult.error)
      }
      const { transactionId, ipfsHash } = networkResult
      await models.Version.create({ report: report.id, transactionId, ipfsHash, type: 'init' })
      report.transactionId = transactionId
      report.ipfsHash = ipfsHash
      report.versionsCount += 1
      await report.save()
      await models.User.findByIdAndUpdate(user.id, { $inc: { reportsCount: 1 }})
      report.text = text
      // pubsub.publish(DOCUMENTS_COUNT, { newDocumentsCount: { count: 1 } });
      return report
    }
  }
}
