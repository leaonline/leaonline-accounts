import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { inviteUser } from '../../../api/accounts/inviteUser'

const users = Meteor.settings.accounts.users

Meteor.startup(() => {
  console.info('DEFAULT: check accounts')
  users.forEach(user => {
    const { email } = user
    if (Accounts.findUserByEmail(email)) {
      // skip this user as she already exists
      console.info(`DEFAULT: User exists for mail ${email}`)
      return
    }
    console.info(`DEFAULT: invite user with email ${email}`)
    try {
      const userId = inviteUser(user)
      console.info(`DEFAULT: user created with id ${userId} - login via ${user.email}`)
    } catch(error) {
      console.error(error)
    }
  })
})
