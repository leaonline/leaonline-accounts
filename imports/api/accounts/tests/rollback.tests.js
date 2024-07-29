/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { Roles } from 'meteor/alanning:roles'
import { stub, restoreAll } from '../../../../tests/testUtils.tests'
import { rollback } from '../rollback'

describe(rollback.name, function () {
  let userId
  let institution
  beforeEach(function () {
    userId = Random.id(10)
    institution = Random.id(10)
  })
  afterEach(function () {
    restoreAll()
  })
  it('does nothing when the user does not exist', async () => {
    stub(Accounts, 'findUserByEmail', () => false)
    expect(await rollback()).to.equal(false)
    expect(await rollback({})).to.equal(false)
    expect(await rollback({ email: Random.id(8) })).to.equal(false)
  })
  it('does nothing when the userId is not matching a user', async () => {
    stub(Accounts, 'findUserByEmail', async () => false)
    stub(Meteor.users, 'removeAsync', async () => 0)
    expect(await rollback({ userId: Random.id(8) })).to.equal(false)
  })
  it('resets the user\'s roles', function (done) {
    stub(Accounts, 'findUserByEmail', () => expect.fail())
    stub(Roles, 'setUserRolesAsync', (updateId, updateRoles, updateInstitution) => {
      expect(updateId).to.equal(userId)
      expect(updateRoles).to.deep.equal([])
      expect(updateInstitution).to.equal(institution)
      done()
    })

    rollback({ userId, institution }).catch(done)
  })

  it('removes the user', async () => {
    stub(Roles, 'setUserRolesAsync', async () => {})
    stub(Meteor.users, 'removeAsync', async ({ _id }) => {
      expect(_id).to.equal(userId)
      return 1
    })
    expect(await rollback({ userId })).to.equal(true)

    stub(Accounts, 'findUserByEmail', async () => ({ _id: userId }))
    expect(await rollback({ email: Random.id(8) })).to.equal(true)
  })
})
