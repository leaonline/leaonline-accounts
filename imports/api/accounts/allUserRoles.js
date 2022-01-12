import { Roles } from 'meteor/alanning:roles'

export const allUserRoles = (user, scope) => Roles.getRolesForUser(user, scope)
