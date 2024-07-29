import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

export const assignRole = async (userId, role, institution, debug = () => {}) => {
  debug('assignRole:', { userId, role, institution })
  const rolesCount = await Meteor.roles.countDocuments({ _id: role })
  if (!rolesCount) {
    throw new Meteor.Error('assignRole.failed', 'assignRole.unknownRole', { role })
  }

  const usersCount = await Meteor.users.countDocuments({ _id: userId })
  if (!usersCount) {
    throw new Meteor.Error('assignRole.failed', 'assignRole.unknownUser', { userId })
  }

  await Roles.addUsersToRolesAsync(userId, role, institution)
  const isInRole = await Roles.userIsInRoleAsync(userId, role, institution)

  if (!isInRole) {
    const details = JSON.stringify({ userId, role, institution })
    throw new Meteor.Error('assignRole.failed', 'assignRole.roleNotAssigned', details)
  }

  return true
}
