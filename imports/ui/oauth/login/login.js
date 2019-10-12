import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Schema } from '../../../api/schema/Schema'
import './login.html'

const loginSchema = Schema.create({
  user: String,
  password: {
    type: String,
    autoform: {
      type: 'password'
    }
  }
})

Template.login.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
})

Template.login.helpers({
  loginSchema () {
    return loginSchema
  },
  errors () {
    return Template.instance().state.get('errors')
  }
})

Template.login.events({
  'submit #loginForm' (event, templateInstance) {
    event.preventDefault()

    const loginFormValues = AutoForm.getFormValues('loginForm')
    const { insertDoc } = loginFormValues
    const errors = loginSchema.validate(insertDoc)
    if (errors && errors.length > 0) {
      templateInstance.state.set('errors', errors)
      return
    } else {
      templateInstance.state.set('errors', null)
    }

    const { user } = insertDoc
    const { password } = insertDoc
    templateInstance.state.set('loggingIn', true)

    Meteor.loginWithPassword(user, password, (err, res) => {
      if (err) {
        return templateInstance.state.set('errors', [ err ])
      }
      if (res) {
        templateInstance.state.set('loggingIn', false)
      }
    })
  }
})
