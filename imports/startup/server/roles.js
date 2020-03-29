/* global Roles */
import { Personas } from '../../api/roles/Personas'
import { Permissions } from '../../api/roles/Permissions'

const createRole = name => {
  if (Meteor.roles.findOne(name)) return
  Roles.createRole(name)
  console.info(`[Roles]: created top-level role ${name}`)
}

// first we ensure all top-level roles are represented by a persona
Object.values(Personas).forEach(({ name }) => createRole(name))

// then we go by each and assign default permissions
// note, that admin should be able to add/edit/remove permissions
// so we can have this default by convention and let admins config

const assignRoles = (persona, namespaces) => {
  namespaces.forEach(namespace => {
    Object.values(namespace).forEach(permission => {
      // if not already created, create new role on this permission
      createRole(permission)

      // if the persona already obtained this role as child
      // just skip the operation at this point
      if (Meteor.roles.findOne({ _id: persona, children: permission })) {
        return
      }

      // otherwise connect the permission with the persona
      Roles.addRolesToParent(permission, persona)
      console.info(`[Roles]: ${persona} permission added [${permission}]`)
    })
  })
}

// Admin -> always assign all permissions
assignRoles(Personas.admin.name, Object.values(Permissions))

// Team members -> all but roles and user mgmt
assignRoles(Personas.team.name, [Permissions.backend, Permissions.classes])

// Teachers
assignRoles(Personas.teacher.name, [Permissions.classes])
