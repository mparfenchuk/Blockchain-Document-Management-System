import { AdminConnection } from 'composer-admin'
import { BusinessNetworkConnection } from 'composer-client'
import { IdCard } from 'composer-common'
import ipfsAPI from 'ipfs-api'

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

const namespace = 'org.nykredit.co';

let adminConnection;

let businessNetworkConnection;

let businessNetworkName = 'nykredit-network';
let factory;

async function importCardForIdentity(cardName, identity) {

  adminConnection = new AdminConnection();

  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  await adminConnection.importCard(cardName, card);
}

export default {

 createUser: async function (cardId, id) {
    try {

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@nykredit-network');

      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      const user = factory.newResource(namespace, 'User', id);
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.User');
      await participantRegistry.add(user);

      const identity = await businessNetworkConnection.issueIdentity(namespace + '.User#' + id, cardId);
      await importCardForIdentity(cardId, identity);

      await businessNetworkConnection.disconnect('admin@nykredit-network');

      return true;
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },

  checkUser: async function (cardId, id) {

    try {

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);
    
      const employeeRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.User');
      
      await employeeRegistry.get(id);

      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },

  createReport: async function (cardId, id, reportId, text) {

    try {

      const content = ipfs.types.Buffer.from(JSON.stringify({ text }));
      const ipfsHash = await ipfs.files.add(content);

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      const reportCreationTransaction = factory.newTransaction(namespace, 'ReportCreationTransaction');
      reportCreationTransaction.creator = factory.newRelationship(namespace, 'User', id);
      reportCreationTransaction.ipfsHash = ipfsHash[0].hash;
      reportCreationTransaction.reportId = reportId;

      await businessNetworkConnection.submitTransaction(reportCreationTransaction);

      await businessNetworkConnection.disconnect(cardId);

      return reportCreationTransaction;
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },

  updateReport: async function (cardId, reportId, text) {

    try {

      const content = ipfs.types.Buffer.from(JSON.stringify({ text }));
      const ipfsHash = await ipfs.files.add(content);

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      const reportUpdatingTransaction = factory.newTransaction(namespace, 'ReportUpdatingTransaction');
      reportUpdatingTransaction.report = factory.newRelationship(namespace, 'Report', reportId);
      reportUpdatingTransaction.newIpfsHash = ipfsHash[0].hash;

      await businessNetworkConnection.submitTransaction(reportUpdatingTransaction);

      await businessNetworkConnection.disconnect(cardId);

      return reportUpdatingTransaction;
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },

  getReport: async function (cardId, reportId) {

    try {

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      const reportResult = await businessNetworkConnection.query('selectReport', { id: reportId });
      const rawReport = await ipfs.files.cat(reportResult[0].ipfsHash);
      const report = JSON.parse(rawReport);

      await businessNetworkConnection.disconnect(cardId);

      return report
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  getReportCreationTransaction: async function (cardId, reportId) {

    try {

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      const reportResult = await businessNetworkConnection.query('selectReportCreationTransaction', { reportId: reportId });
      const rawReport = await ipfs.files.cat(reportResult[0].ipfsHash);
      const report = JSON.parse(rawReport);

      await businessNetworkConnection.disconnect(cardId);

      return report
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  getReportUpdatingTransaction: async function (cardId, transactionId) {

    try {

      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      const reportResult = await businessNetworkConnection.query('selectReportUpdatingTransaction', { transactionId: transactionId });
      const rawReport = await ipfs.files.cat(reportResult[0].newIpfsHash);
      const report = JSON.parse(rawReport);

      await businessNetworkConnection.disconnect(cardId);

      return report
    }
    catch(err) {
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  }
}
