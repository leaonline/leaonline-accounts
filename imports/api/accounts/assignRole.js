import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const assignRole = (userId, role, institution) => {
  if (!Meteor.roles.find(role).count()) {
    throw new Meteor.Error('assignRole.failed', 'assignRole.unknownRole', { role })
  }

  if (!Meteor.users.find(userId).count()) {
    throw new Meteor.Error('assignRole.failed', 'assignRole.unkownUser', { userId })
  }

  console.debug('[addUsersToRoles]:', userId, role, institution)
  Roles.addUsersToRoles(userId, role, institution)

  if (!Roles.userIsInRole(userId, role, institution)) {
    const details = JSON.stringify({ userId, role, institution })
    throw new Meteor.Error('assignRole.failed', 'assignRole.roleNotAssigned', details)
  }

  return true
}
