import { Meteor } from 'meteor/meteor'

export const cleanupRoles = async (info = () => {}) => {
  const removeRoles = []
  const userIds = new Set()

  // first get all userIds and add them to the set
  await Meteor.users.find({}).forEach(u => userIds.add(u._id))

  // then search for all roles that are assigned to
  // uesrs that don't exist
  await Meteor.roleAssignment.find().forEach(doc => {
    if (!userIds.has(doc.user._id)) {
      removeRoles.push(doc._id)
    }
  })

  if (removeRoles.length > 0) {
    info('remove', removeRoles.length, 'roles')
    const removed = await Meteor.roleAssignment.removeAsync({
      _id: { $in: removeRoles }
    })

    info(removed)
    return removed
  }

  return 0
}
