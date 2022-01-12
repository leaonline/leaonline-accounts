import { Roles } from 'meteor/alanning:roles'

export const hasRole = (userId, role, institution) => Roles.userIsInRole(userId, role, institution)
