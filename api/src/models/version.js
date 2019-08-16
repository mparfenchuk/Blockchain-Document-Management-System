import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const versionSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  transactionId: String,
  ipfsHash: String,
  type: { type: String, default: 'sec' }
}, {
  timestamps: true
})

versionSchema.plugin(mongoosePaginate);

const Version = mongoose.model('Version', versionSchema)

export default Version
