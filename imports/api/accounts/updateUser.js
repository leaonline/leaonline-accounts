import { Meteor } from 'meteor/meteor'
import { assignRoles } from './assignRoles'
import { hasRole } from './hasRole'
import { removeRoles } from './removeRoles'
import { allUserRoles } from './allUserRoles'

/**
 * Updates the existing user, based on the user config. Targeted fields are
 * - firstName
 * - lastName
 * - roles
 *
 * @param config
 * @param user
 * @param debug
 */
export const updateUser = (config, user, debug = () => {}) => {
  let updateRequired = false
  let rolesChanged = false
  const modifier = {}

  if (config.firstName !== user.firstName) {
    updateRequired = true
    modifier.$set = modifier.$set || {}
    modifier.$set.firstName = config.firstName
  }

  if (config.lastName !== user.lastName) {
    updateRequired = true
    modifier.$set = modifier.$set || {}
    modifier.$set.lastName = config.lastName
  }

  // take away old roles
  const allRoles = allUserRoles(user._id, user.institution)
  const rolesToRemove = allRoles.filter(role => !config.roles.includes(role))

  if (rolesToRemove.length > 0) {
    debug(config.email, { rolesToRemove })

    const removed = removeRoles(user._id, rolesToRemove, user.institution)
    const verified = rolesToRemove.every(role => !hasRole(user._id, role, user.institution))
    updateRequired = removed && verified

    if (!updateRequired) {
      throw new Meteor.Error('updateUser.error', 'updateUser.removeRoleFailed', { rolesToRemove, removed, verified })
    }

    rolesChanged = true
  }

  // adding new roles works the following way:
  // all roles in config are checked if user has this role
  const rolesToAdd = config.roles.filter(role => !hasRole(user._id, role, user.institution))

  if (rolesToAdd.length > 0) {
    debug(config.email, { rolesToAdd })

    const assigned = assignRoles(user._id, config.roles, user.institution)
    const verified = rolesToAdd.every(role => hasRole(user._id, role, user.institution))
    updateRequired = assigned && verified

    if (!updateRequired) {
      throw new Meteor.Error('updateUser.error', 'updateUser.assignRoleFailed', { rolesToAdd, assigned, verified })
    }

    rolesChanged = true
  }

  if (updateRequired) {
    if (rolesChanged) {
      modifier.$set = modifier.$set || {}
      modifier.$set.roles = allUserRoles(user._id, user.institution)
    }

    debug('changes detected', modifier)
    const updated = Meteor.users.update(user._id, modifier)
    debug({
      modifier,
      rolesToAdd,
      rolesToRemove,
      updated
    })

    return updated
  }

  return 0
}
