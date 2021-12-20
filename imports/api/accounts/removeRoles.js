import { removeRole } from './removeRole'

export const removeRoles = (userId, roles, institution) => roles.every(role => removeRole(userId, role, institution))
