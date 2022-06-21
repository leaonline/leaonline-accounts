/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { removeRole } from '../removeRole'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { restoreAll, stub } from '../../../../tests/testUtils.tests'

describe(removeRole.name, function () {
  let userId
  let role
  let institution

  beforeEach(function () {
    userId = Random.id()
    role = Random.id()
    institution = Random.id()
  })

  afterEach(function () {
    restoreAll()
  })

  it('throws if role does not exist', function () {
    expect(() => removeRole(userId, role, institution)).to.throw('removeRole.unknownRole')
  })
  it('throws if user does not exist', function () {
    stub(Meteor.roles, 'find', () => ({ count: () => 1 }))
    expect(() => removeRole(userId, role, institution)).to.throw('removeRole.unkownUser')
  })
  it('throws if user has not role', function () {
    stub(Meteor.roles, 'find', () => ({ count: () => 1 }))
    stub(Meteor.users, 'find', () => ({ count: () => 1 }))
    stub(Roles, 'userIsInRole', () => false)
    expect(() => removeRole(userId, role, institution)).to.throw('removeRole.roleNotAssigned')
  })
  it('throws if the role has not been removed', function () {
    stub(Meteor.roles, 'find', () => ({ count: () => 1 }))
    stub(Meteor.users, 'find', () => ({ count: () => 1 }))
    stub(Roles, 'removeUsersFromRoles', () => true)
    stub(Roles, 'userIsInRole', () => true)
    expect(() => removeRole(userId, role, institution)).to.throw('removeRole.roleNotRemoved')
  })
  it('removes the role from user', function () {
    stub(Meteor.roles, 'find', () => ({ count: () => 1 }))
    stub(Meteor.users, 'find', () => ({ count: () => 1 }))
    stub(Roles, 'removeUsersFromRoles', () => true)
    let count = 0
    stub(Roles, 'userIsInRole', () => !(count++))
    expect(removeRole(userId, role, institution)).to.equal(true)
  })
})
