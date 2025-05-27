import { updateUser } from '../../accounts/updateUser'
import { Meteor } from 'meteor/meteor'

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

	const isAdmin = userDoc.roles?.includes('admin')
	// no updates on an admin
	if (isAdmin) {
		throw new Meteor.Error('errors.permissionDenied', 'admin.noUpdateOnAdmin')
	}

	// no lifting of user to become admin
	if (!isAdmin && updateDoc.roles?.includes('admin')) {
		throw new Meteor.Error('errors.permissionDenied', 'admin.noLifting')
	}

	return updateUser(updateDoc, userDoc, this.debug)
}
