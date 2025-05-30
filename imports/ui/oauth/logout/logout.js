import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import './logout.html'

Template.logout.events({
	'click .logoutButton'(event) {
		event.preventDefault()
		Meteor.logout((err) => console.error(err))
	},
})
