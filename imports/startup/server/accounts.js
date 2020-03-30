import { Meteor } from 'meteor/meteor'
import { inviteUser } from '../../api/accounts/inviteUser'

const users = Meteor.settings.users

Meteor.startup(() => {
  users.forEach(user => {
    const username = user.username
    if (Meteor.users.findOne({ username })) {
      // skip this user as she already exists
      return
    }

    const userId = inviteUser(user)
    if (Meteor.isDevelopment) {
      console.info(`DEFAULT: user created with id ${userId} - login via ${username}`)
    }
  })
})
