import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const rollback = ({ userId, institution } = {}) => {
  if (!userId) return false
  Roles.setUserRoles(userId, [], institution)
  return !!Meteor.users.remove(userId)
}
