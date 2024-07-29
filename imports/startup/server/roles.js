import { Roles } from 'meteor/alanning:roles'
import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'

const { clients } = Meteor.settings.oauth

const createRole = async name => {
  check(name, String)
  if (await Meteor.roles.findOneAsync(name)) {
    return console.info(`[Roles]: top-level role ${name} already exists`)
  }

  await Roles.createRoleAsync(name)
  console.info(`[Roles]: created top-level role ${name}`)
}

for (const entry of clients) {
  const { key } = entry
  await createRole(key)
}

// for this application
await createRole('admin')
