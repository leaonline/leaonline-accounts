import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const removeRole = (userId, role, institution) => {
  if (!Meteor.roles.find(role).count()) {
    throw new Meteor.Error('removeRole.failed', 'removeRole.unknownRole', role)
  }

  if (!Meteor.users.find(userId).count()) {
    throw new Meteor.Error('removeRole.failed', 'removeRole.unkownUser')
  }

  if (!Roles.userIsInRole(userId, role, institution)) {
    const details = JSON.stringify({ userId, role, institution })
    throw new Meteor.Error('removeRole.failed', 'removeRole.roleNotAssigned', details)
  }

  Roles.removeUsersFromRoles(userId, role, institution)

  if (Roles.userIsInRole(userId, role, institution)) {
    const details = JSON.stringify({ userId, role, institution })
    throw new Meteor.Error('removeRole.failed', 'removeRole.roleNotRemoved', details)
  }

  return true
}
