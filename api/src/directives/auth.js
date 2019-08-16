import jsonwebtoken from 'jsonwebtoken'
import { SchemaDirectiveVisitor, AuthenticationError, ValidationError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

import { JWT_SECRET } from '../config'

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function (...args) {
      const [, , { req, connection, network, models  }] = args

      let token = ""
      if(connection) {
        token = connection.context.token
      } else {
        token = req.headers['token']
      }

      if (token) {
          
        let decoded
        try {
          decoded = await jsonwebtoken.verify(token, JWT_SECRET)
        } catch (e) {
          throw new AuthenticationError('Your session expired. Sign in again.')
        }  

        const passport = decoded.passport

        const userInDB = await models.User.findOne({ passport })
        if (!userInDB) {
          throw new AuthenticationError('There is no such user.')
        }

        // const userInBC = await network.checkUser(passport, userInDB.id)
        // if (userInBC.error != null) {
        //   throw new AuthenticationError(userInBC.error)
        // }

        args[1] = { user: userInDB, ...args[1]}

        return await resolve.apply(this, args)

      } else {
        throw new AuthenticationError('You must be signed in.')
      }
    }
  }
}

export default AuthDirective