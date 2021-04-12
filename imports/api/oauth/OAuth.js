import { Meteor } from 'meteor/meteor'

const settings = Meteor.settings.oauth.clients
const clients = new Map()

settings.forEach(entry => {
  clients.set(entry.clientId, entry.key)
})

export const OAuth = {}

OAuth.getClientKey = clientId => clients.get(clientId)
