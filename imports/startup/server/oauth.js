import { Meteor } from 'meteor/meteor'
import { OAuth2Server } from 'meteor/leaonline:oauth2-server'
import { canUserAccessClient } from '../../api/accounts/canUserAccessClient'

const { clients } = Meteor.settings.oauth
const urls = Meteor.settings.public.oauth

const oauth2server = new OAuth2Server({
  serverOptions: {
    addAcceptedScopesHeader: true,
    addAuthorizedScopesHeader: true,
    allowBearerTokensInQueryString: false,
    allowEmptyState: false,
    authorizationCodeLifetime: 300,
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 1209600,
    allowExtendedTokenAttributes: false,
    requireClientAuthentication: true
  },
  model: {
    accessTokensCollectionName: 'oauth_access_tokens',
    refreshTokensCollectionName: 'oauth_refresh_tokens',
    clientsCollectionName: 'oauth_clients',
    authCodesCollectionName: 'oauth_auth_codes',
    debug: false
  },
  routes: {
    accessTokenUrl: urls.accessTokenUrl,
    authorizeUrl: urls.authorizeUrl,
    errorUrl: '/oauth/error',
    fallbackUrl: '/oauth/*'
  },
  debug: true
})

OAuth2Server.validateUser(canUserAccessClient)

oauth2server.authenticatedRoute().get(urls.identityUrl, function (req, res, next) {
  const user = Meteor.users.findOne(req.data.user.id)

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  const body = JSON.stringify({
    id: user._id,
    login: user.username,
    email: user.emails && user.emails[0].address,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`
  })
  res.end(body)
})

Meteor.startup(() => {
  Object.values(clients).forEach(entry => {
    console.log(`[OAuth2Server]: register client <${entry.title}>`)
    oauth2server.registerClient(entry)
  })
})
