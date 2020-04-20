/* global Roles */
import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
const { clients } = Meteor.settings.oauth

const createRole = name => {
  check(name, String)
  if (Meteor.roles.findOne(name)) return
  Roles.createRole(name)
  console.info(`[Roles]: created top-level role ${name}`)
}

Object.values(clients).forEach(entry => {
  const { key } = entry
  createRole(key)
})
