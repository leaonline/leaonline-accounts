import { removeRole } from './removeRole'

export const removeRoles = async (userId, roles, institution) => {
	for (const role of roles) {
		const done = await removeRole(userId, role, institution)
		if (!done) return false
	}
	return true
}
