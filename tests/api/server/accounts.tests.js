/* eslint-env mocha */
describe('accounts', function () {
  import '../../../imports/api/accounts/assignRole.test'
  import '../../../imports/api/accounts/removeRole.tests'
  import '../../../imports/api/accounts/canUserAccessClient.tests'
  import '../../../imports/api/accounts/rollback.tests'
  import '../../../imports/api/accounts/createUser.tests'
  import '../../../imports/api/accounts/createInviteUser.tests'
  import '../../../imports/api/accounts/cleanupRoles.tests'
  import '../../../imports/api/accounts/updateUser.tests'
  import '../../../imports/api/accounts/schema/createUserSchema.tests'
})
