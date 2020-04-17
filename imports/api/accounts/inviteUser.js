/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { check, Match } from 'meteor/check'

const createUser = ({ email, username, firstName, persona, lastName, institution }) => {
  check(email, String)
  check(persona, String)
  check(firstName, String)
  check(lastName, String)
  check(institution, String)
  check(username, Match.Maybe(String))
  if (Accounts.findUserByEmail(email) || (username && Accounts.findUserByUsername(username))) {
    throw new Meteor.Error('createUser.userExists')
  }

  const password = Random.id(32)
  const userDef = { email, password }
  if (username) {
    userDef.username = username
  }

  const userId = Accounts.createUser(userDef)
  const updated = Meteor.users.update(userId, { $set: { firstName, lastName, institution, persona } })

  if (!updated) {
    throw new Meteor.Error('createUser.updateFailed')
  }

  return userId
}

const assignRole = (userId, persona, institution) => {
  if (!Meteor.roles.findOne(persona)) {
    throw new Meteor.Error('assignRole.unknownRole', undefined, persona)
  }

  Roles.addUsersToRoles(userId, persona, institution)

  if (!Roles.userIsInRole(userId, persona, institution)) {
    const details = JSON.stringify({ userId, persona, institution })
    throw new Meteor.Error('assignRole.unexpected', undefined, details)
  }
}

const sendEnrollmentEmail = userId => {
  Accounts.sendEnrollmentEmail(userId)
}

export const inviteUser = ({ email, username, persona, firstName, lastName, institution }) => {
  check(email, String)
  check(persona, String)
  check(firstName, String)
  check(lastName, String)
  check(institution, String)
  check(username, Match.Maybe(String))

  const userId = createUser({ email, username, firstName, lastName, persona, institution })
  assignRole(userId, persona, institution)
  sendEnrollmentEmail(userId)
  return userId
}
