/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { Roles } from 'meteor/alanning:roles'
import { stub, restoreAll } from '../../../tests/testUtils.tests'
import { rollback } from './rollback'

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
    expect(rollback()).to.equal(false)
    expect(rollback({})).to.equal(false)
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

  it('removes the user', function (done) {
    stub(Meteor.users, 'remove', _id => {
      expect(_id).to.equal(userId)
      done()
    })
    rollback({ userId })
  })
})
