import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

export const checkPermissions = function (options) {
  const { name, roles, isPublic } = options

  if (isPublic) { return options }

  const runFct = options.run
  options.run = function run (...args) {
    const userId = this.userId
    const user = userId && Meteor.users.findOne(userId)

    if (!userId || !Roles.userIsInRole(userId, roles, user.institution)) {
      throw new Meteor.Error('errors.permissionDenied', 'errors.insufficientPrivileges', { userId, name })
    }

    return runFct.call(this, ...args)
  }

  return options
}
