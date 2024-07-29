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

    return async function ({ ids } = {}) {
      const query = {
        _id: { $nin: [this.userId] }
      }

      if (ids?.length) { query._id.$in = ids }

      return Meteor.users.find(query, { fields }).fetchAsync()
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

    /**
     * @param options.email
     * @param options.username
     * @param options.firstName
     * @param options.lastName
     * @param options.institution
     */
    return async function (options = {}) {
      // we never let any use create an admin,
      // even if they are admin!
      // The only way to lift a user to admin is by
      // updating the settings files and re-deploy
      const adminIndex = options.roles.indexOf('admin')

      if (adminIndex > -1) {
        options.roles.splice(adminIndex, 1)
      }

      const userId = await createUser(options)
      await assignRoles(userId, options.roles, options.institution)
      await Accounts.sendEnrollmentEmail(userId)
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

    return async function (options = {}) {
      const { _id, ...updateDoc } = options
      const userDoc = await Meteor.users.findOneAsync(_id)

      if (!userDoc) {
        throw new Meteor.Error('errors.permissionDenied', 'errors.docNotFound')
      }

      const isAdmin = userDoc.roles?.includes('admin')
      // no updates on an admin
      if (isAdmin) {
        throw new Meteor.Error('errors.permissionDenied', 'admin.noUpdateOnAdmin')
      }

      // no lifting of user to become admin
      if (!isAdmin && updateDoc.roles?.includes('admin')) {
        throw new Meteor.Error('errors.permissionDenied', 'admin.noLifting')
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

    return async function ({ userId } = {}) {
      const userDoc = await Meteor.users.findOneAsync(userId)

      if (!userDoc) {
        throw new Meteor.Error('errors.permissionDenied', 'errors.docNotFound')
      }

      if (userDoc.roles?.includes('admin')) {
        throw new Meteor.Error('errors.permissionDenied', 'admin.noUpdateOnAdmin')
      }

      // remove all roles
      await removeRoles(userDoc._id, userDoc.roles, userDoc.institution)
      await Meteor.users.removeAsync({ _id: userId })
    }
  })
}
