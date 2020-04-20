const SimpleSchema = require('simpl-schema')
const oauthFlows = ['authorization_code']
const rlativeUrl = /\/[a-zA-Z\/-]+/
const schema = def => new SimpleSchema(def)

SimpleSchema.RegEx.IdOf = (min = 17, max = 128) => new RegExp(`^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{${min},${max}}$`)

const settingsSchema = schema({
  public: schema({
    oauth: schema({
      dialogUrl: {
        type: String,
        regEx: rlativeUrl
      },
      accessTokenUrl: {
        type: String,
        regEx: rlativeUrl
      },
      authorizeUrl: {
        type: String,
        regEx: rlativeUrl
      },
      identityUrl: {
        type: String,
        regEx: rlativeUrl
      }
    })
  }),
  accounts: schema({
    emailTemplates: schema({
      siteName: String,
      from: {
        type: String,
        regEx: SimpleSchema.RegEx.EmailWithTLD
      }
    }),
    config: schema({
      forbidClientAccountCreation: Boolean,
      ambiguousErrorMessages: Boolean,
      sendVerificationEmail: Boolean,
      loginExpirationInDays: SimpleSchema.Integer,
      passwordResetTokenExpirationInDays: SimpleSchema.Integer,
      passwordEnrollTokenExpirationInDays: SimpleSchema.Integer
    }),
    users: {
      type: Array,
      optional: true
    },
    'users.$': schema({
      username: {
        type: String,
        optional: true
      },
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.EmailWithTLD
      },
      firstName: String,
      lastName: String,
      institution: String,
      roles: Array,
      'roles.$': String
    })
  }),
  oauth: Object,
  'oauth.clients': Array,
  'oauth.clients.$': schema({
    key: String,
    title: String,
    description: String,
    clientId: {
      type: String,
      regEx: SimpleSchema.RegEx.IdOf(16)
    },
    secret: {
      type: String,
      regEx: SimpleSchema.RegEx.IdOf(32)
    },
    url: {
      type: String,
      regEx: SimpleSchema.RegEx.WeakUrl
    },
    redirectUris: Array,
    'redirectUris.$': {
      type: String,
      regEx: SimpleSchema.RegEx.WeakUrl
    },
    grants: Array,
    'grants.$': {
      type: String,
      allowedValues: oauthFlows
    }
  })
})

module.exports = function (settings) {
  settingsSchema.validate(settings)
}
