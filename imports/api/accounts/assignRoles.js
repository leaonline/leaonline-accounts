import { assignRole } from './assignRole'

export const assignRoles = async (userId, roles, institution) => {
  for (const role of roles) {
    const done = await assignRole(userId, role, institution)
    if (!done) return false
  }
  return true
}
