import { Meteor } from 'meteor/meteor'

export const cleanupRoles = async (info = () => {}) => {
	const removeRoles = []
	const userIds = new Set()

	// first get all userIds and add them to the set
	await runEach({
		cursor: Meteor.users.find({}),
		fn: (u) => userIds.add(u._id),
	})

	// then search for all roles that are assigned to
	// uesrs that don't exist
	await runEach({
		cursor: Meteor.roleAssignment.find({}),
		fn: (doc) => {
			if (!userIds.has(doc.user._id)) {
				removeRoles.push(doc._id)
			}
		},
	})

	if (removeRoles.length > 0) {
		info('remove', removeRoles.length, 'roles')
		const removed = await Meteor.roleAssignment.removeAsync({
			_id: { $in: removeRoles },
		})

		info(removed)
		return removed
	}

	return 0
}

const runEach = async ({ fn, cursor }) => {
	const array = await cursor.fetchAsync()
	for (const item of array) {
		fn(item)
	}
}
