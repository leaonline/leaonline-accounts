import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

import '../login/login'
import '../logout/logout'
import './authorize.html'

const authorizedClientsSub = Meteor.subscribe('authorizedOAuth')

// Subscribe the list of already authorized clients
// to auto accept
Template.authorize.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()

  // check params against our definitions
  // https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
  instance.autorun(() => {
    const scope = FlowRouter.getQueryParam('scope')
    instance.state.set('scope', scope && scope.split('+'))
  })

  // subscription
  instance.autorun(() => {
    instance.state.set('authorizedSubReady', authorizedClientsSub.ready())
    console.log(authorizedClientsSub.ready())
  })
})

Template.authorize.helpers({
  loadComplete () {
    const instance = Template.instance()
    return instance.state.get('authorizedSubReady')
  },
  getToken: function () {
    return window.localStorage.getItem('Meteor.loginToken')
  },
  scope () {
    return Template.instance().state.get('scope')
  },
  errors () {
    const errors = Template.instance().state.get('errors')
    return errors && errors.length > 0 && errors
  }
})

// Auto click the submit/accept button if user already
// accepted this client
Template.authorize.onRendered(function () {
  const instance = this
  const data = instance.data
  this.autorun(function (computation) {
    const user = Meteor.user()
    console.log("user", user)
    console.log("data", data)
    if (user && user.oauth && user.oauth.authorizedClients && user.oauth.authorizedClients.includes(data.client_id) > -1) {
      computation.stop()
      console.log('auto autorize')
      window.$('#authorize-button').click()
    }
  })
})
