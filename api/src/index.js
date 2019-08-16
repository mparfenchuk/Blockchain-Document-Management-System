import 'dotenv/config'
import http from 'http'
import express from 'express'
import mongoose from 'mongoose' 
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import models from './models'
import network from './scripts/network.js'

import { APP_PORT, IN_PROD, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from './config'

(async () => {
  try {
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true }
    )

    const app = express();

    app.use(cors());

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: !IN_PROD,
      context: ({ req, res, connection }) => ({ req, res, connection, network, models })
    })

    server.applyMiddleware({ app })

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({ port: APP_PORT }, () => {
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`);
      console.log(`ws://localhost:${APP_PORT}${server.subscriptionsPath}`)
    })

  } catch (e) {
    console.error(e)
  }
})()