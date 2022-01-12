import { Meteor } from 'meteor/meteor'

export const cleanupRoles = (info = () => {}) => {
  const removeRoles = []
  const userIds = new Set()

  // first get all userIds and add them to the set
  Meteor.users.find().forEach(u => userIds.add(u._id))

  // then search for all roles that are assigned to
  // uesrs that don't exist
  Meteor.roleAssignment.find().forEach(doc => {
    if (!userIds.has(doc.user._id)) {
      removeRoles.push(doc._id)
    }
  })

  if (removeRoles.length > 0) {
    info('remove', removeRoles.length, 'roles')
    const removed = Meteor.roleAssignment.remove({
      _id: { $in: removeRoles }
    })

    info(removed)
    return removed
  }

  return 0
}
