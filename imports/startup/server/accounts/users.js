import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { createInviteUser } from '../../../api/accounts/createInviteUser'
import { createLog } from '../../../api/log/createLog'
import { rollback } from '../../../api/accounts/rollback'
import { assignRole } from '../../../api/accounts/assignRole'
import { createUser } from '../../../api/accounts/createUser'
import { updateUser } from '../../../api/accounts/updateUser'
import { cleanupRoles } from '../../../api/accounts/cleanupRoles'

const users = Meteor.settings.accounts.users
const info = createLog('Accounts')
const inviteUser = createInviteUser({
  createUserHandler: createUser,
  rolesHandler: async ({ userId, roles, institution }) => {
    for (const role of roles) {
      await assignRole(userId, role, institution)
    }
  },
  errorHandler: async ({ userId, email, institution, error }) => {
    console.error(error) // TODO LOG ERROR

    info(`invitation failed for ${email} (userId=${userId})`)
    return rollback({ userId, email, institution })
  }
})

Meteor.startup(async () => {
  info('check accounts')
  for (const configUser of users) {
    const { email, retry } = configUser
    const existingUser = await Accounts.findUserByEmail(email)

    if (existingUser && !retry) {
      // skip this user as she already exists
      info(`User exists for mail ${email}, check for changes`)

      await updateUser(configUser, existingUser, info)
    }

    // there is a retry option BUT ONLY for users that have yet no valid email
    // addresss, for example due to a failed creation
    if (existingUser && retry && !(existingUser.emails[0]?.verified)) {
      info(`retry - remove user for ${email}`)
      await Meteor.users.removeAsync(existingUser._id)
    }

    if (!existingUser) {
      info(`invite user with email ${email}`)
      const userId = await inviteUser(configUser)

      if (userId) {
        info(`user created with id ${userId} - for ${email}`)
      }
    }
  }

  // finally always cleanup Roles after all changes have been applied
  await cleanupRoles(info)
})
