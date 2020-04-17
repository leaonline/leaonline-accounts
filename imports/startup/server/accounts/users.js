import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { inviteUser } from '../../../api/accounts/inviteUser'

const users = Meteor.settings.accounts.users

Meteor.startup(() => {
  users.forEach(user => {
    const { email } = user
    if (Accounts.findUserByEmail(email)) {
      // skip this user as she already exists
      return
    }

    const userId = inviteUser(user)
    if (Meteor.isDevelopment) {
      console.info(`DEFAULT: user created with id ${userId} - login via ${user.email}`)
    }
  })
})
