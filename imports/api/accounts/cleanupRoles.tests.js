/* eslint-env mocha */
import { cleanupRoles } from './cleanupRoles'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import {
  mockCollection,
  clearCollection,
  restoreCollection
} from '../../../tests/mockCollection'
import { Meteor } from 'meteor/meteor'

describe(cleanupRoles.name, function () {
  before(function () {
    Meteor.users = mockCollection({
      name: 'users',
      collection: Meteor.users
    })
    Meteor.roleAssignment = mockCollection({
      name: 'role-assignment',
      collection: Meteor.roleAssignment
    })
  })

  after(function () {
    Meteor.users = restoreCollection({ name: 'users' })
    Meteor.roleAssignment = restoreCollection({ name: 'role-assignment' })
  })

  afterEach(function () {
    clearCollection({ collection: Meteor.users })
    clearCollection({ collection: Meteor.roleAssignment })
  })

  it('removes roles for which no users exist anymore', function () {
    Meteor.users.insert({ _id: Random.id(), roles: ['foo', 'bar'] })

    expect(cleanupRoles()).to.equal(0)

    Meteor.roleAssignment.insert({
      user: {
        _id: Random.id()
      }
    })

    expect(Meteor.roleAssignment.find().count()).to.equal(1)
    expect(cleanupRoles()).to.equal(1)
    expect(Meteor.roleAssignment.find().count()).to.equal(0)
  })
})
