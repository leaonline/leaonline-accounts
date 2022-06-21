/* eslint-env mocha */
describe('accounts', function () {
  import '../../../imports/api/accounts/tests/assignRole.test'
  import '../../../imports/api/accounts/tests/removeRole.tests'
  import '../../../imports/api/accounts/tests/canUserAccessClient.tests'
  import '../../../imports/api/accounts/tests/rollback.tests'
  import '../../../imports/api/accounts/tests/createUser.tests'
  import '../../../imports/api/accounts/tests/createInviteUser.tests'
  import '../../../imports/api/accounts/tests/cleanupRoles.tests'
  import '../../../imports/api/accounts/tests/updateUser.tests'
  import '../../../imports/api/accounts/schema/createUserSchema.tests'
})
