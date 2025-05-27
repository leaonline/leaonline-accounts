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
	this.state = new ReactiveDict()

	// check params against our definitions
	// https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
	this.autorun(() => {
		const data = Template.currentData()
		const { scope } = data.queryParams
		this.state.set('scope', scope?.split('+'))
	})

	// subscription
	this.autorun(() => {
		const authorizedSubReady = authorizedClientsSub.ready()
		this.state.set('authorizedSubReady', authorizedSubReady)
	})

	this.autorun(() => {
		if (!Meteor.userId()) return
		if (!this.state.get('autoSignIn')) return

		setTimeout(() => {
			this.$('#authForm').submit()
		}, 300)
	})
})

Template.authorize.helpers({
	loadComplete() {
		const instance = Template.instance()
		return instance.state.get('authorizedSubReady')
	},
	getToken: () => window.localStorage.getItem('Meteor.loginToken'),
	scope() {
		return Template.instance().state.get('scope')
	},
	errors() {
		const errors = Template.instance().state.get('errors')
		return errors && errors.length > 0 && errors
	},
	autoSignIn() {
		return Template.instance().state.get('autoSignIn')
	},
})

Template.authorize.events({
	'click .logout-button'(event, templateInstance) {
		event.preventDefault()
		templateInstance.state.set('autoSignIn', true)
		Meteor.logout()
	},
})
