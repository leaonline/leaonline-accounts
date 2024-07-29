import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { Random } from 'meteor/random'

/**
 * Creates a new user (account) by given credentials.
 * @param userCredentials.email {string}
 * @param userCredentials.username {string?}
 * @param userCredentials.firstName {string}
 * @param userCredentials.lastName {string}
 * @param userCredentials.institution {string}
 * @param userCredentials.password {string?}
 * @return {string} userId
 */
export const createUser = async (userCredentials = {}) => {
  check(userCredentials, Match.ObjectIncluding({
    email: String,
    firstName: String,
    lastName: String,
    institution: String,
    username: Match.Maybe(String),
    password: Match.Maybe(String)
  }))

  const { email, username, password, ...profile } = userCredentials

  if (await Accounts.findUserByEmail(email) || (username && await Accounts.findUserByUsername(username))) {
    throw new Meteor.Error('createUser.failed', 'createUser.userExists')
  }

  const userDef = { email, password: (password || Random.id(32)) }
  if (username) {
    userDef.username = username
  }

  const userId = await Accounts.createUserAsync(userDef)
  const updated = await Meteor.users.updateAsync(userId, { $set: profile })

  if (!updated) {
    throw new Meteor.Error('createUser.failed', 'createUser.updateFailed')
  }

  return userId
}
