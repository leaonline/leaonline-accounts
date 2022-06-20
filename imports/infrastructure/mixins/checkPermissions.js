import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

export const checkPermissions = function (options) {
  const { name, roles } = options

  const runFct = options.run
  options.run = function run (...args) {
    const userId = this.userId
    const user = userId && Meteor.users.findOne(userId)

    if (!userId || !Roles.userIsInRole(userId, roles, user.institution)) {
      throw new Meteor.Error('errors.forbidden', 'errors.permissionDenied', { userId, name })
    }

    return runFct.call(this, ...args)
  }

  return options
}
