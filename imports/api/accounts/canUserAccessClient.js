import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { OAuth } from '../oauth/OAuth'

export const canUserAccessClient = async ({ user, client }) => {
  if (!user?._id || !client?.clientId) {
    return false
  }

  const { clientId } = client
  const { institution } = user
  const userId = user._id
  const clientKey = await OAuth.getClientKey(clientId)
  const isInRole = await Roles.userIsInRoleAsync(userId, clientKey, institution)

  if (!isInRole) {
    await Meteor.users.updateAsync({ _id: userId }, { $set: { 'services.resume.loginTokens': [] } })
    return false
  }
  else {
    return true
  }
}
