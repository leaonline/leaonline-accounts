import { assignRole } from './assignRole'

export const assignRoles = (userId, roles, institution) => roles.forEach(role => assignRole(userId, role, institution))
