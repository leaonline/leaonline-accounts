import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'
import './enroll.html'

Template.enrol.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
})

Template.enrol.helpers({

})

Template.enroll.events({
  'submit #enrollmentForm' (event, templateInstance) {
    event.preventDefault()
    const password = document.querySelector('#password-input').value
    const token = templateInstance.data.params.token

    Accounts.resetPassword(token, password, (resetError) => {
      if (resetError) {
        console.error(resetError)
      } else {
        console.log('successful!', Meteor.user())
      }
    })
  }
})
