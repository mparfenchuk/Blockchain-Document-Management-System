import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const reportSchema = new mongoose.Schema({
  type: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionId: String,
  ipfsHash: String,
  versionsCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

reportSchema.plugin(mongoosePaginate);

const Report = mongoose.model('Report', reportSchema)

export default Report
