import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { hash, compare } from 'bcryptjs'

const userSchema = new mongoose.Schema({
  role: String,
  passport: {
    type: String,
    validate: {
      validator: passport => User.doesntExist({ passport }),
      message: ({ value }) => `Passport ${value} has already been taken.`
    }
  },
  password: String,
  firstName: String,
  lastName: String,
  reportsCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
})

userSchema.statics.doesntExist = async function (options) {
  return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password)
}

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema)

export default User
