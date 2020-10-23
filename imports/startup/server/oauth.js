import { Meteor } from 'meteor/meteor'
import { OAuth2Server } from 'meteor/leaonline:oauth2-server'
import { canUserAccessClient } from '../../api/accounts/canUserAccessClient'

const { clients, server, model, debug } = Meteor.settings.oauth
const routes = Meteor.settings.public.oauth
const oauth2server = new OAuth2Server({
  serverOptions: server,
  model: model,
  routes: routes,
  debug: true
})

oauth2server.validateUser(canUserAccessClient)

oauth2server.authenticatedRoute().get(routes.identityUrl, function (req, res, next) {
  const user = Meteor.users.findOne(req.data.user.id)

  // TODO fail with 404 if user is not found

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  const body = user
    ? JSON.stringify({
      id: user._id,
      login: user.username,
      email: user.emails && user.emails[0]?.address,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`
    })
    : ''

  res.end(body)
})

Meteor.startup(() => {
  Object.values(clients).forEach(entry => {
    console.log(`[OAuth2Server]: register client <${entry.title}>`)
    oauth2server.registerClient(entry)
  })
})
