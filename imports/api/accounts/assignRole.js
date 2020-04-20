import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const assignRole = (userId, role, institution) => {
  if (!Meteor.roles.findOne(role)) {
    throw new Meteor.Error('assignRole.unknownRole', undefined, role)
  }

  Roles.addUsersToRoles(userId, role, institution)

  if (!Roles.userIsInRole(userId, role, institution)) {
    const details = JSON.stringify({ userId, role, institution })
    throw new Meteor.Error('assignRole.unexpected', undefined, details)
  }
}
