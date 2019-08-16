/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Report Creation Transaction
 * @param {org.nykredit.co.ReportCreationTransaction} ReportCreationTransaction
 * @transaction
 */
async function reportCreationTransaction(tx) {
    
    const reportRegistry  = await getAssetRegistry('org.nykredit.co.Report');

    var factory = getFactory();
    var report = factory.newResource('org.nykredit.co', 'Report', tx.reportId);
    report.creator = tx.creator;
    report.ipfsHash = tx.ipfsHash;
    
    await reportRegistry.add(report);
}

/**
 * Report Updating Transaction
 * @param {org.nykredit.co.ReportUpdatingTransaction} ReportUpdatingTransaction
 * @transaction
 */
async function reportUpdatingTransaction(tx) {
    
    const reportRegistry  = await getAssetRegistry('org.nykredit.co.Report');

    tx.report.ipfsHash = tx.newIpfsHash;

    await reportRegistry.update(tx.report);
}