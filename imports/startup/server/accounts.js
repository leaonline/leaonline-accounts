import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const users = Meteor.settings.users

Meteor.startup(() => {
  users.forEach(user => {
    const username = user.username
    if (Meteor.users.findOne({ username })) {
      // skip this user as she already exists
      return
    }

    const password = user.password
    const userId = Accounts.createUser({ username, password })
    if (Meteor.isDevelopment) {
      console.info(`DEFAULT: user created with id ${userId} - login via ${username}`)
    }
  })
})
