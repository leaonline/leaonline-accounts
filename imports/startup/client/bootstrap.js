/* global AutoForm */
import { Meteor } from 'meteor/meteor'
import '@fortawesome/fontawesome-free/js/all'
import 'bootstrap'
import popper from '@popperjs/core'
import { AutoFormThemeBootstrap5 } from 'meteor/communitypackages:autoform-bootstrap5/dynamic'
import { AutoFormPassword2 } from 'meteor/jkuester:autoform-password2/dynamic'
import 'meteor/aldeed:autoform/dynamic'
import './theme.scss'

global.Popper = global.Popper || popper

async function init() {
	await AutoForm.load()
	await AutoFormThemeBootstrap5.load()
	await AutoFormPassword2.load()
	AutoForm.setDefaultTemplate('bootstrap5')
}

Meteor.startup(async () => {
	await init()
	console.info({ AutoFormThemeBootstrap5 })
})
