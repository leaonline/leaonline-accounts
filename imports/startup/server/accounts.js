import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const userId = Accounts.createUser({ username: 'admin', password: 'password' })
    console.info(`DEFAULT: user created with id ${userId} - login via admin / password and change username and password`)
  }
})
