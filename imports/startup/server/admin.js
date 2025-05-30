import { Admin } from '../../api/admin/Admin'
import { createMethod } from '../../infrastructure/factories/createMethod'
import { rateLimitMethods } from 'meteor/leaonline:ratelimit-factory'

const methods = Object.values(Admin.methods)
for (const method of methods) {
	console.debug('[createMethod]:', method.name)
	createMethod(method)
}
rateLimitMethods(methods)
