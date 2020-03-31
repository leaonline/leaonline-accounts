import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'
import './enroll.html'

Template.enroll.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()

  if (Meteor.user() || Meteor.userId()) {
    // we log out here because we can't know for sure,
    // if there is a multi-user machine in use, so we
    // assume the current operation to be fundamental
    // to the email receiver and clear any login user
    Meteor.logoutOtherClients()
    Meteor.logout(error => {
      if (error) instance.state.set({ error })
      instance.state.set('ready', true)
    })
  } else {
    instance.state.set('ready', true)
  }
})

Template.enroll.helpers({
  error () {
    return Template.instance().state.get('error')
  },
  ready () {
    return Template.instance().state.get('ready')
  }
})

Template.enroll.events({
  'submit #enrollmentForm' (event, templateInstance) {
    event.preventDefault()
    const password = document.querySelector('#password-input').value
    const token = templateInstance.data.params.token

    templateInstance.state.set('resetting', true)
    Accounts.resetPassword(token, password, (error) => {
      templateInstance.state.set('resetting', false)
      if (error) {
        templateInstance.state.set({ error })
      } else {
        console.log('successful!', Meteor.user())
      }
    })
  }
})
