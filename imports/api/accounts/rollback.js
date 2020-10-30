import { Roles } from 'meteor/alanning:roles'

export const rollback = user => {
  Roles.setUserRoles(user._id, [], user.institution)
  return Meteor.users.remove(user._id)
}
