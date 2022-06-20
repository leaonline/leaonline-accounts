import { Meteor } from 'meteor/meteor'
import { createUserSchema } from '../accounts/schema/createUserSchema'
import { onServerExec } from '../utils/onServerExec'

export const Admin = {
  name: 'admin'
}

Admin.methods = {}

Admin.methods.getUsers = {
  name: 'admin.methods.getUsers',
  schema: {
    ids: {
      type: Array,
      optional: true
    },
    'ids.$': String
  },
  roles: 'admin',
  numRequests: 1,
  timeInterval: 1000,
  run: onServerExec(function () {
    const fields = { services: 0, oauth: 0 }

    return function ({ ids }) {
      const query = {}

      if (ids) {
        query._id = { $in: ids }
      }

      query._id = { $nin: [this.userId] }

      return Meteor.users.find(query, { fields }).fetch()
    }
  })
}

Admin.methods.createUser = {
  name: 'admin.methods.createUser',
  schema: createUserSchema,
  roles: 'admin',
  numRequests: 1,
  timeInterval: 1000,
  run: onServerExec(function () {
    import { Accounts } from 'meteor/accounts-base'
    import { createUser } from '../accounts/createUser'
    import { assignRoles } from '../accounts/assignRoles'

    return function (options) {
      // we never let any use create an admin,
      // even if they are admin!
      // The only way to lift a user to admin is by
      // updating the settings files and re-deploy
      const adminIndex = options.roles.indexOf('admin')

      if (adminIndex > -1) {
        options.roles.splice(adminIndex, 1)
      }

      const userId = createUser(options)
      assignRoles(userId, options.roles, options.institution)
      Accounts.sendEnrollmentEmail(userId)
      return userId
    }
  })
}

Admin.methods.updateUser = {
  name: 'admin.methods.updateUser',
  schema: {
    _id: String,
    ...createUserSchema
  },
  roles: 'admin',
  numRequests: 1,
  timeInterval: 1000,
  run: onServerExec(function () {
    import { updateUser } from '../accounts/updateUser'

    return function (options) {
      const { _id, ...updateDoc } = options
      const userDoc = Meteor.users.findOne(_id)

      if (!userDoc) {
        throw new Meteor.Error('errors.docNotFound', 'user.notFound')
      }

      if (userDoc.roles.includes('admin')) {
        throw new Meteor.Error('errors.permissionDenied')
      }

      return updateUser(updateDoc, userDoc, this.debug)
    }
  })
}

Admin.methods.removeUser = {
  name: 'admin.methods.removeUser',
  schema: { userId: String },
  roles: 'admin',
  numRequests: 1,
  timeInterval: 1000,
  run: onServerExec(function () {
    import { removeRoles } from '../accounts/removeRoles'

    return function ({ userId }) {
      const userDoc = Meteor.users.findOne(userId)

      if (!userDoc || userDoc.roles.includes('admin')) {
        throw new Meteor.Error('errors.forbidden', 'errors.permissionDenied')
      }

      // remove all roles
      removeRoles(userDoc._id, userDoc.roles, userDoc.institution)
      Meteor.users.remove({ _id: userId })
    }
  })
}
