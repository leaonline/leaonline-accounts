import { Meteor } from 'meteor/meteor'

const settings = Meteor.settings.oauth.clients
const clients = new Map()

settings.forEach(entry => {
  clients.set(entry.clientId, entry.key)
})

export const OAuth = {}

OAuth.getClientKey = clientId => clients.get(clientId)

OAuth.getIdentity = userId => {
  const user = userId && Meteor.users.findOne(userId)
  if (!user) return

  return {
    id: user._id,
    login: user.username,
    email: user.emails?.[0]?.address,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    roles: [].concat(user.roles || [])
  }
}
