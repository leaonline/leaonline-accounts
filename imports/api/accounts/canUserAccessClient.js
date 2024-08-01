import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { OAuth } from '../oauth/OAuth'

/**
 * Determines, whether a given user is allowed to access
 * one of the lea. applications.
 * @param user {object}
 * @param user._id {string}
 * @param user.institution {string?}
 * @param client {object}
 * @param client.clientId {string}
 * @return {Promise<boolean>}
 */
export const canUserAccessClient = async ({ user, client }) => {
  if (!user?._id || !client?.clientId) {
    return false
  }

  const { clientId } = client
  const { institution } = user
  const userId = user._id
  const clientKey = OAuth.getClientKey(clientId)
  const isInRole = await Roles.userIsInRoleAsync(userId, clientKey, institution)

  if (!isInRole) {
    // in this case we revoke the token to
    // reduce the chance of access
    await Meteor.users.updateAsync({ _id: userId }, { $set: { 'services.resume.loginTokens': [] } })
    return false
  }
  else {
    return true
  }
}
