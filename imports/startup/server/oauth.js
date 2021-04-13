import { Meteor } from 'meteor/meteor'
import { OAuth2Server } from 'meteor/leaonline:oauth2-server'
import { canUserAccessClient } from '../../api/accounts/canUserAccessClient'
import { OAuth } from '../../api/oauth/OAuth'

const { clients, server, model, debug } = Meteor.settings.oauth
const routes = Meteor.settings.public.oauth
const oauth2server = new OAuth2Server({
  serverOptions: server,
  model: model,
  routes: routes,
  debug: debug
})

oauth2server.validateUser(function (userData) {
  return canUserAccessClient(userData)
})

oauth2server.authenticatedRoute().get(routes.identityUrl, function (req, res) {
  const userId = req?.data?.user?.id
  const user = OAuth.getIdentity(userId)
  const status = user ? 200 : 404

  res.writeHead(status, {
    'Content-Type': 'application/json'
  })

  const body = user
    ? JSON.stringify(user)
    : JSON.stringify({
      error: 'user not found',
      response: `request user [${userId}] not found`
    })

  res.end(body)
})

Meteor.startup(() => {
  Object.values(clients).forEach(entry => {
    console.log(`[OAuth2Server]: register client <${entry.title}>`)
    oauth2server.registerClient(entry)
  })
})
