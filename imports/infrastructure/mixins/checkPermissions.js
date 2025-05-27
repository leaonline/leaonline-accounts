import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

export const checkPermissions = (options) => {
	const { name, roles, isPublic } = options

	if (isPublic) {
		return options
	}

	const runFct = options.run
	options.run = async function run(...args) {
		const userId = this.userId

		if (!userId) {
			throw new Meteor.Error(
				'errors.permissionDenied',
				'errors.insufficientPrivileges',
				{ userId, name },
			)
		}

		const user = await Meteor.users.findOneAsync(userId)
		const hasRole =
			user && (await Roles.userIsInRoleAsync(userId, roles, user.institution))

		if (!hasRole) {
			throw new Meteor.Error(
				'errors.permissionDenied',
				'errors.insufficientPrivileges',
				{ userId, name },
			)
		}

		return runFct.call(this, ...args)
	}

	return options
}
