import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const rollback = user => {
  Roles.setUserRoles(user._id, [], user.institution)
  return Meteor.users.remove(user._id)
}
