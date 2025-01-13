import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { OAuth2Server } from 'meteor/leaonline:oauth2-server'
import { canUserAccessClient } from '../../api/accounts/canUserAccessClient'
import { OAuth } from '../../api/oauth/OAuth'

const { clients, server, model, debug } = Meteor.settings.oauth
const routes = Meteor.settings.public.oauth
const oauth2server = new OAuth2Server({
  serverOptions: server,
  model: {
    accessTokensCollection: new Mongo.Collection(null),
    refreshTokensCollection: new Mongo.Collection(null),
    clientsCollectionName: model.clientsCollectionName,
    authCodesCollection: new Mongo.Collection(null),
    debug: true
  },
  routes,
  debug: true
})

oauth2server.validateUser(function (userData) {
  return canUserAccessClient(userData)
})

oauth2server.authenticatedRoute().get(routes.identityUrl, async function (req, res) {
  const userId = req?.data?.user?.id
  const user = await OAuth.getIdentity(userId)

  res.status(user ? 200 : 404)
  res.set({ 'Content-Type': 'application/json' })

  const body = user
    ? user
    : { error: 'user not found', response: `request user [${userId}] not found` }

  res.json(body)
})

Meteor.startup(async () => {
  for (const client of clients) {
    await oauth2server.registerClient(client)
  }
})
