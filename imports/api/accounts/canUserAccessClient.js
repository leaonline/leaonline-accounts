import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import {OAuth } from '../oauth/OAuth'

export const canUserAccessClient = ({ user, client }) => {
  if (!user?._id || !client?.clientId) {
    return false
  }

  const { clientId } = client
  const { institution } = user
  const userId = user._id
  const clientKey = OAuth.getClientKey(clientId)

  if (!Roles.userIsInRole(userId, clientKey, institution)) {
    Meteor.users.update({ _id: userId }, { $set: { 'services.resume.loginTokens': [] } })
    return false
  } else {
    return true
  }
}
