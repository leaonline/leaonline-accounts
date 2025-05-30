import { Roles } from 'meteor/alanning:roles'

/**
 *
 * @param user
 * @param scope
 * @return {Promise<[string]>}
 */
export const allUserRoles = (user, scope) =>
	Roles.getRolesForUserAsync(user, scope)
