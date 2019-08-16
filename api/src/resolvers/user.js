import { UserInputError } from 'apollo-server-express'
import jsonwebtoken from 'jsonwebtoken'

import { JWT_SECRET } from '../config'

const createToken = async (passport) => {
  const token = await jsonwebtoken.sign(
    {
      passport: passport
    },
    JWT_SECRET,
    {
      expiresIn: '2h'
    })
  return token
}

export default {
  Query: {
    me: async (root, { user }, context, info) => {
      return user
    },
    user: async (root, { id }, { models }, info) => {
      const user = await models.User.findById(id)
      if (!user) {
        throw new UserInputError('There is no such user.')
      }
      return user
    },
    users: async (root, { string, page, limit, order }, { models }, info) => {
      return await models.User.paginate({ "$or": [{
          'firstName' : { '$regex' : string, '$options' : 'i' }
        }, {
          'lastName' : { '$regex' : string, '$options' : 'i' }
        }]
      }, { page: page, limit: limit, sort: { createdAt: order} })
    }
  },
  Mutation: {
    login: async (root, { passport, password }, { network, models }, info) => {
      const errorMsg = "Incorrect passport or password. Please try again."
      const userInDB = await models.User.findOne({ passport })
      if (!userInDB) {
        throw new UserInputError(errorMsg)
      }
      if (!await userInDB.matchesPassword(password)) {
        throw new UserInputError(errorMsg)
      }
      const userInBC = await network.checkUser(passport, userInDB.id)
      if (userInBC.error != null) {
        throw new UserInputError(userInBC.error)
      }
      return { token: createToken(passport) }
    },
    signUp: async (root, args, { network, models }, info) => {
      const user = await models.User.create(args)
      const networkResult = await network.createUser(user.passport, user.id)
      if (networkResult.error != null) {
        throw new UserInputError(networkResult.error)
      }
      return { token: createToken(user.passport) }
    }
  }
}
