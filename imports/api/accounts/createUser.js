import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { Random } from 'meteor/random'

/**
 *
 * @param userCredentials.email
 * @param userCredentials.username
 * @param userCredentials.firstName
 * @param userCredentials.lastName
 * @param userCredentials.institution
 * @return {any}
 */
export const createUser = (userCredentials = {}) => {
  check(userCredentials, Match.ObjectIncluding({
    email: String,
    firstName: String,
    lastName: String,
    institution: String,
    username: Match.Maybe(String)
  }))

  const { email, username, ...profile } = userCredentials

  if (Accounts.findUserByEmail(email) || (username && Accounts.findUserByUsername(username))) {
    throw new Meteor.Error('createUser.failed', 'createUser.userExists')
  }

  const password = Random.id(32)
  const userDef = { email, password }
  if (username) {
    userDef.username = username
  }

  const userId = Accounts.createUser(userDef)
  const updated = Meteor.users.update(userId, { $set: profile })

  if (!updated) {
    throw new Meteor.Error('createUser.failed', 'createUser.updateFailed')
  }

  return userId
}
