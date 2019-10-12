import './logout.html'

Template.logout.events({
  'click .logoutButton' (event, templateInstance) {
    event.preventDefault()
    Meteor.logout(err => console.error(err))
  }
})
