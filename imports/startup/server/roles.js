import { Roles } from 'meteor/alanning:roles'
import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'

const { clients } = Meteor.settings.oauth

const createRole = name => {
  check(name, String)
  if (Meteor.roles.findOne(name)) {
    return console.info(`[Roles]: top-level role ${name} already exists`)
  }

  Roles.createRole(name)
  console.info(`[Roles]: created top-level role ${name}`)
}

Object.values(clients).forEach(entry => {
  const { key } = entry
  createRole(key)
})
