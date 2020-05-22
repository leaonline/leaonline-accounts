import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict'

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
    const data = Template.currentData()
    const { scope } = data.queryParams
    instance.state.set('scope', scope && scope.split('+'))
  })

  // subscription
  instance.autorun(() => {
    const authorizedSubReady = authorizedClientsSub.ready()
    instance.state.set('authorizedSubReady', authorizedSubReady)
  })

  instance.autorun(() => {
    if (!Meteor.userId()) return
    if (!instance.state.get('autoSignIn')) return

    setTimeout(() => {
      instance.$('#authForm').submit()
    }, 300)
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
  },
  autoSignIn () {
    return Template.instance().state.get('autoSignIn')
  }
})

Template.authorize.events({
  'click .logout-button' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('autoSignIn', true)
    Meteor.logout()
  }
})
