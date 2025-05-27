import { Accounts } from 'meteor/accounts-base'
import { createUser } from '../../accounts/createUser'
import { assignRoles } from '../../accounts/assignRoles'

/**
 * Creates a new user by given options
 * @param {Object} options
 * @param options.email
 * @param options.username
 * @param options.roles
 * @param options.firstName
 * @param options.lastName
 * @param options.institution
 */
export const createUserAdmin = async (options = {}) => {
	// we never let any use create an admin,
	// even if they are admin!
	// The only way to lift a user to admin is by
	// updating the settings files and re-deploy
	const adminIndex = options.roles.indexOf('admin')

	if (adminIndex > -1) {
		options.roles.splice(adminIndex, 1)
	}

	const userId = await createUser(options)
	await assignRoles(userId, options.roles, options.institution)
	await Accounts.sendEnrollmentEmail(userId)
	return userId
}
