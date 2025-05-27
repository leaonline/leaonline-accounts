/* eslint-env mocha */
describe('accounts', () => {
	require('../../../imports/api/accounts/assignRole.test')
	require('../../../imports/api/accounts/removeRole.tests')
	require('../../../imports/api/accounts/canUserAccessClient.tests')
	require('../../../imports/api/accounts/rollback.tests')
	require('../../../imports/api/accounts/createUser.tests')
	require('../../../imports/api/accounts/createInviteUser.tests')
	require('../../../imports/api/accounts/cleanupRoles.tests')
	require('../../../imports/api/accounts/updateUser.tests')
	require('../../../imports/api/accounts/schema/createUserSchema.tests')
})
