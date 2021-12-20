import { assignRole } from './assignRole'

export const assignRoles = (userId, roles, institution) => roles.every(role => assignRole(userId, role, institution))
