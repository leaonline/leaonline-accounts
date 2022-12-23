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
 * @param update
 * @param original
 * @param debug
 */
export const updateUser = (update, original, debug = () => {}) => {
  let updateRequired = false
  let rolesChanged = false
  let institutionChanged = false
  const modifier = {}

  if (update.firstName !== original.firstName) {
    updateRequired = true
    modifier.$set = modifier.$set || {}
    modifier.$set.firstName = update.firstName
  }

  if (update.lastName !== original.lastName) {
    updateRequired = true
    modifier.$set = modifier.$set || {}
    modifier.$set.lastName = update.lastName
  }

  if (original.institution !== update.institution) {
    updateRequired = true
    institutionChanged = true
    modifier.$set = modifier.$set || {}
    modifier.$set.institution = update.institution
  }

  // take away old roles
  const allRoles = allUserRoles(original._id, original.institution)
  const rolesToRemove = allRoles.filter(role => institutionChanged || !original.roles?.includes(role))

  if (rolesToRemove.length > 0) {
    debug(original.email, { rolesToRemove, institution: original.institution })

    // note that we need to use original here, because
    // if institution changes, we would not remove the original roles
    const removed = removeRoles(original._id, rolesToRemove, original.institution)
    const verified = rolesToRemove.every(role => !hasRole(original._id, role, original.institution))
    updateRequired = removed && verified

    if (!updateRequired) {
      throw new Meteor.Error('updateUser.error', 'updateUser.removeRoleFailed', { rolesToRemove, removed, verified })
    }

    rolesChanged = true
  }

  // adding new roles works the following way:
  // all roles in config are checked if user has this role
  const rolesToAdd = update.roles.filter(role => institutionChanged || !hasRole(original._id, role, original.institution))

  if (rolesToAdd.length > 0) {
    debug(update.email, { rolesToAdd, institution: update.institution })

    const assigned = assignRoles(original._id, update.roles, update.institution)
    const verified = rolesToAdd.every(role => hasRole(original._id, role, update.institution))
    updateRequired = assigned && verified

    if (!updateRequired) {
      throw new Meteor.Error('updateUser.error', 'updateUser.assignRoleFailed', { rolesToAdd, assigned, verified })
    }

    rolesChanged = true
  }

  if (updateRequired) {
    if (rolesChanged) {
      modifier.$set = modifier.$set || {}
      modifier.$set.roles = allUserRoles(original._id, update.institution)
    }

    debug('changes detected', modifier)
    const updated = Meteor.users.update(original._id, modifier)
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
