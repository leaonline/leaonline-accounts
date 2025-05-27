import { Meteor } from 'meteor/meteor'

const fields = { services: 0, oauth: 0 }

export const getUsersAdmin = async function ({ ids } = {}) {
	const query = {
		_id: { $nin: [this.userId] },
	}

	if (ids?.length) {
		query._id.$in = ids
	}

	return Meteor.users.find(query, { fields }).fetchAsync()
}
