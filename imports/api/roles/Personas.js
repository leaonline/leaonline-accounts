/**
 * A Persona is like a role but in order to avoid confusion withe the {Roles} api
 * we use the more psychological oriented term "Persona".
 */

export const Personas = {}

/**
 * Admin has the unrestricted permissions level (0) and can perform any operations.
 */

Personas.admin = {
  level: 0,
  name: 'admin'
}

/**
 * A team member is a person of the lea. core team which has less permissions than an Administrator but
 * should access to the applications backend and edit content.
 */
Personas.team = {
  level: 1,
  name: 'team'
}

/**
 * A teacher is a person that uses the dashboard and should have read access to the participant's data.
 */

Personas.teacher = {
  level: 2,
  name: 'teacher'
}

/**
 * A user represents the most restricted person within the system. Usually this person is a participant
 * that solves units and sends responses.
 */

Personas.user = {
  level: 3,
  name: 'user'
}
