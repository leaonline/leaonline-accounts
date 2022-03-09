/* global AutoForm */
import { Meteor } from 'meteor/meteor'
import '@fortawesome/fontawesome-free/js/all'
import 'bootstrap'
import popper from 'popper.js'
import autoformBs4 from 'meteor/communitypackages:autoform-bootstrap4'
import { AutoFormThemeBootstrap4 } from 'meteor/communitypackages:autoform-bootstrap4/dynamic'
import { AutoFormPassword2 } from 'meteor/jkuester:autoform-password2/dynamic'
import 'meteor/aldeed:autoform/dynamic'
import './theme.scss'

global.Popper = global.Popper || popper

async function init () {
  await AutoForm.load()
  await AutoFormThemeBootstrap4.load()
  await AutoFormPassword2.load()
  AutoForm.setDefaultTemplate('bootstrap4')
}

Meteor.startup(() => {
  init()
  console.info({ autoformBs4 })
})
