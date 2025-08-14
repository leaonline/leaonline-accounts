import { updateUser } from '../../accounts/updateUser'
import { Meteor } from 'meteor/meteor'
import { hasRole } from '../../accounts/hasRole'

/**
 * Updates a user by given options (Admin-only)
 * @param options {object}
 * @return {Promise<number>} the number of updated documents
 */
export const updateUserAdmin = async function (options = {}) {
	const { _id, ...updateDoc } = options
	const userDoc = await Meteor.users.findOneAsync(_id)

	if (!userDoc) {
		throw new Meteor.Error('errors.permissionDenied', 'errors.docNotFound')
	}

	const self = await Meteor.users.findOneAsync(this.userId)
	const targetIsAdmin = userDoc.roles?.includes('admin')
	const becomeAdmin = updateDoc.roles?.includes('admin')
	const selfIsAdmin = (targetIsAdmin || becomeAdmin) && (await hasRole(self?._id, 'admin', userDoc?.institution))

	// no updates on an admin
	if (targetIsAdmin && !selfIsAdmin) {
		throw new Meteor.Error('errors.permissionDenied', 'admin.noUpdateOnAdmin')
	}

	// no lifting of user to become admin
	if (becomeAdmin && !selfIsAdmin) {
		throw new Meteor.Error('errors.permissionDenied', 'admin.noLifting')
	}

	return updateUser(updateDoc, userDoc, this.debug)
}
