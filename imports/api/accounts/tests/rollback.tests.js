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
  it('does nothing when the user does not exist', function () {
    stub(Accounts, 'findUserByEmail', () => false)
    expect(rollback()).to.equal(false)
    expect(rollback({})).to.equal(false)
    expect(rollback({ email: Random.id(8) })).to.equal(false)

    stub(Meteor.users, 'remove', () => 0)
    expect(rollback({ userId: Random.id(8) })).to.equal(false)
  })
  it('resets the user\'s roles', function (done) {
    stub(Roles, 'setUserRoles', (updateId, updateRoles, updateInstitution) => {
      expect(updateId).to.equal(userId)
      expect(updateRoles).to.deep.equal([])
      expect(updateInstitution).to.equal(institution)
      done()
    })

    rollback({ userId, institution })
  })

  it('removes the user', function () {
    stub(Roles, 'setUserRoles', () => {})
    stub(Meteor.users, 'remove', _id => {
      expect(_id).to.equal(userId)
      return 1
    })
    expect(rollback({ userId })).to.equal(true)

    stub(Accounts, 'findUserByEmail', () => ({ _id: userId }))
    expect(rollback({ email: Random.id(8) })).to.equal(true)
  })
})
