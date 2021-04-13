import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { createInviteUser } from '../../../api/accounts/createInviteUser'
import { createInfoLog } from '../../../api/log/createLog'
import { rollback } from '../../../api/accounts/rollback'
import { assignRole } from '../../../api/accounts/assignRole'
import { createUser } from '../../../api/accounts/createUser'

const users = Meteor.settings.accounts.users
const info = createInfoLog('Accounts')
const inviteUser = createInviteUser({
  createUserHandler: createUser,
  rolesHandler: ({ userId, roles, institution }) => assignRole(userId, roles, institution),
  errorHandler: ({ userId, email, institution, error }) => {
    console.error(error) // TODO LOG ERROR

    info(`invitation failed for ${email} (userId=${userId})`)
    return rollback({ userId, email, institution })
  }
})

Meteor.startup(() => {
  info('check accounts')
  users.forEach(user => {
    const { email, retry } = user
    const existingUser = Accounts.findUserByEmail(email)

    if (existingUser && !retry) {
      // skip this user as she already exists
      info(`User exists for mail ${email}`)
      return
    }

    // there is a retry option BUT ONLY for users that have yet no valid email
    // addresss, for example due to a failed creation
    if (existingUser && retry && !(existingUser.emails[0]?.verified)) {
      info(`retry - remove user for ${email}`)
      Meteor.users.remove(existingUser._id)
    }

    info(`invite user with email ${email}`)
    const userId = inviteUser(user)
    if (userId) {
      info(`user created with id ${userId} - for ${email}`)
    }
  })
})
