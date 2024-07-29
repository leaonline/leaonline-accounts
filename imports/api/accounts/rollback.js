import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

export const rollback = async ({ userId, email, institution } = {}) => {
  if (userId) {
    return reset(userId, institution)
  }

  if (email) {
    const failedUser = await Accounts.findUserByEmail(email)
    if (failedUser) {
      return reset(failedUser._id, failedUser.institution)
    }
  }

  return false
}

const reset = async (userId, institution) => {
  await Roles.setUserRolesAsync(userId, [], institution)
  const removed = await Meteor.users.removeAsync({ _id: userId })
  return !!removed
}
