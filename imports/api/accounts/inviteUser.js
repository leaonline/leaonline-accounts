import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { assignRoles } from './assignRoles'
import { createUser } from './createUser'

export const inviteUser = ({ email, username, firstName, lastName, institution, roles }) => {
  check(email, String)
  check(firstName, String)
  check(lastName, String)
  check(institution, String)
  check(username, Match.Maybe(String))
  check(roles, [String])

  const userId = createUser({ email, username, firstName, lastName, institution })
  assignRoles(userId, roles, institution)
  Accounts.sendEnrollmentEmail(userId)
  return userId
}
