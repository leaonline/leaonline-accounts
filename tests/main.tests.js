import { Meteor } from 'meteor/meteor'

if (Meteor.isServer) {
  (function () {
    import './api/server/accounts.tests'
    import './api/server/contexts.tests'
    import './api/server/mixins.tests'
    import './api/server/oauth.tests'
  })()
}
