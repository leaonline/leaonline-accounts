import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { Random } from 'meteor/random'

export const createUser = ({ email, username, firstName, lastName, institution }) => {
  check(email, String)
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
  const updated = Meteor.users.update(userId, { $set: { firstName, lastName, institution } })

  if (!updated) {
    throw new Meteor.Error('createUser.updateFailed')
  }

  return userId
}
