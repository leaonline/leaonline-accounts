import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'

/**
 * Creates an invitation method, that first delegates user creation and role
 * assigment to the injected functions and sends an email, in case the
 * invitation succeeded.
 *
 * If there was an error during the invitation, the rollback handler will be
 * invoked to clean up the maybe-created user docs and states.
 *
 * Finally sends an Email on succeeded creation.
 *
 * @param handlers.rolesHandler
 * @param handlers.createUserHandler
 * @param handlers.errorHandler
 * @return {function({
    email: String,
    firstName: String,
    lastName: String,
    institution: String,
    username: String|undefined,
    roles: [String]
  })}
 */
export const createInviteUser = (handlers = {}) => {
  check(handlers, Match.ObjectIncluding({
    rolesHandler: Function,
    createUserHandler: Function,
    errorHandler: Function
  }))

  return (userDefinitions = {}) => {
    check(userDefinitions, Match.ObjectIncluding({
      email: String,
      firstName: String,
      lastName: String,
      institution: String,
      username: Match.Maybe(String),
      password: Match.Maybe(String),
      roles: [String]
    }))

    const { institution, roles } = userDefinitions
    const invitationRequired = !(userDefinitions.password)

    let userId
    try {
      // delegate user creation to external implementaiton
      userId = handlers.createUserHandler(userDefinitions)

      // delegate roles assignment to external implementation
      handlers.rolesHandler({ userId, roles, institution })

      if (invitationRequired) {
        Accounts.sendEnrollmentEmail(userId)
      }
      return userId
    }
    catch (error) {
      handlers.errorHandler({ userId, error, ...userDefinitions })
    }
  }
}
