import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

export const rollback = ({ userId, email, institution } = {}) => {
  if (userId) {
    return reset(userId, institution)
  }

  if (email) {
    const failedUser = Accounts.findUserByEmail(email)
    if (failedUser) {
      return reset(failedUser._id, failedUser.institution)
    }
  }

  return false
}

const reset = (userId, institution) => {
  Roles.setUserRoles(userId, [], institution)
  return !!Meteor.users.remove(userId)
}
