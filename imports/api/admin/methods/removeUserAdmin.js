import { removeRoles } from '../../accounts/removeRoles'
import { Meteor } from 'meteor/meteor'

export const removeUserAdmin = async ({ userId } = {}) => {
	const userDoc = await Meteor.users.findOneAsync(userId)

	if (!userDoc) {
		throw new Meteor.Error('errors.permissionDenied', 'errors.docNotFound')
	}

	if (userDoc.roles?.includes('admin')) {
		throw new Meteor.Error('errors.permissionDenied', 'admin.noUpdateOnAdmin')
	}

	// remove all roles
	await removeRoles(userDoc._id, userDoc.roles, userDoc.institution)
	await Meteor.users.removeAsync({ _id: userId })
}
