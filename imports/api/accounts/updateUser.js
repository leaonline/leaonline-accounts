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
 * @param update {object} the object containing fields to update
 * @param original {object} the original user document
 * @param debug {function?} pass a debugging fn
 */
export const updateUser = async (update, original, debug = () => {}) => {
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

  // get users current roles for matching
  const currentRoles = await allUserRoles(original._id, original.institution)

  // take away old roles
  const rolesToRemove = currentRoles.filter(role => institutionChanged || !update.roles.includes(role))
  if (rolesToRemove.length > 0) {
    debug(original.email, { rolesToRemove, institution: original.institution })

    // note that we need to use original here, because
    // if institution changes, we would not remove the original roles
    const removed = await removeRoles(original._id, rolesToRemove, original.institution)
    let verified = true
    for (const role of rolesToRemove) {
      const assigned = await hasRole(original._id, role, original.institution)
      if (assigned) verified = false
    }
    updateRequired = removed && verified

    if (!updateRequired) {
      throw new Meteor.Error('updateUser.error', 'updateUser.removeRoleFailed', { rolesToRemove, removed, verified })
    }

    rolesChanged = true
  }

  // adding new roles works the following way:
  // all roles in config are checked if user has this role
  const rolesToAdd = []

  for (const role of update.roles) {
    if (institutionChanged || !currentRoles.includes(role)) {
      rolesToAdd.push(role)
    }
  }

  if (rolesToAdd.length > 0) {
    debug(update.email, { rolesToAdd, institution: update.institution })

    const assigned = await assignRoles(original._id, update.roles, update.institution)
    let verified = true
    for (const role of rolesToAdd) {
      const has = await hasRole(original._id, role, update.institution)
      if (!has) verified = false
    }
    updateRequired = assigned && verified

    if (!updateRequired) {
      debug('failed', { rolesToAdd, assigned, verified })
      throw new Meteor.Error('updateUser.error', 'updateUser.assignRoleFailed', { rolesToAdd, assigned, verified })
    }

    rolesChanged = true
  }

  if (updateRequired) {
    if (rolesChanged) {
      modifier.$set = modifier.$set || {}
      modifier.$set.roles = await allUserRoles(original._id, update.institution)
    }

    debug('changes detected', modifier)
    const updated = await Meteor.users.updateAsync(original._id, modifier)
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
