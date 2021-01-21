import { Meteor } from 'meteor/meteor'
const settings = Meteor.settings.oauth.clients
const clients = {}

settings.forEach(entry => {
  clients[entry.clientId] = entry.key
})

export const getClientKey = clientId => Object.hasOwnProperty.call(clients, clientId) && clients[clientId]
