import { createUserSchema } from '../accounts/schema/createUserSchema'
import { onServerExec } from '../utils/onServerExec'
import { createUserAdmin } from './methods/createUserAdmin'
import { updateUserAdmin } from './methods/updateUserAdmin'
import { getUsersAdmin } from './methods/getUsersAdmin'

export const Admin = {
	name: 'admin',
}

Admin.methods = {}

Admin.methods.getUsers = {
	name: 'admin.methods.getUsers',
	schema: {
		ids: {
			type: Array,
			optional: true,
		},
		'ids.$': String,
	},
	roles: 'admin',
	numRequests: 1,
	timeInterval: 1000,
	run: onServerExec(() => {
		const { getUsersAdmin } = require('./methods/getUsersAdmin')
		return getUsersAdmin
	}),
}

Admin.methods.createUser = {
	name: 'admin.methods.createUser',
	schema: createUserSchema,
	roles: 'admin',
	numRequests: 1,
	timeInterval: 1000,
	run: onServerExec(() => {
		const { createUserAdmin } = require('./methods/createUserAdmin')
		return createUserAdmin
	}),
}

Admin.methods.updateUser = {
	name: 'admin.methods.updateUser',
	schema: {
		_id: String,
		...createUserSchema,
	},
	roles: 'admin',
	numRequests: 1,
	timeInterval: 1000,
	run: onServerExec(() => {
		const { updateUserAdmin } = require('./methods/updateUserAdmin')
		return updateUserAdmin
	}),
}

Admin.methods.removeUser = {
	name: 'admin.methods.removeUser',
	schema: { userId: String },
	roles: 'admin',
	numRequests: 1,
	timeInterval: 1000,
	run: onServerExec(() => {
		const { removeUserAdmin } = require('./methods/removeUserAdmin')
		return removeUserAdmin
	}),
}
