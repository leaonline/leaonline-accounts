import { Roles } from 'meteor/alanning:roles'
import { getClientKey } from '../oauth/getClientKey'

export const canUserAccessClient = ({ user, client }) => {
  const { clientId } = client
  const { institution } = user
  const userId = user._id
  const clientKey = getClientKey(clientId)

  console.info(`[canUserAccessClient]: ${userId} + ${clientId} = ${Roles.userIsInRole(userId, clientKey, institution)}`)
  if (!Roles.userIsInRole(userId, clientKey, institution)) {
    Meteor.users.update({ _id: userId }, { $set: { "services.resume.loginTokens": [] } });
    return false
  } else {
    return true
  }
}
