/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { assignRole } from './assignRole'
import { restoreAll, stub } from '../../../tests/testUtils.tests'

describe(assignRole.name, function () {
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

  it('throws if the given role is not found', function () {
    expect(() => assignRole(userId, role)).to.throw('assignRole.unknownRole')
  })
  it('throws if the given user is not found', function () {
    stub(Meteor.roles, 'find', () => ({ count: (() => 1) }))
    expect(() => assignRole(userId, role)).to.throw('assignRole.unkownUser')
  })
  it('throws if the user role is not assigned', function () {
    stub(Meteor.roles, 'find', () => ({ count: (() => 1) }))
    stub(Meteor.users, 'find', () => ({ count: (() => 1) }))
    stub(Roles, 'addUsersToRoles', () => true)
    expect(() => assignRole(userId, role)).to.throw('assignRole.roleNotAssigned')
  })
})
