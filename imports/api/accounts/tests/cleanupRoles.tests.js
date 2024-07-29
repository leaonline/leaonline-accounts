/* eslint-env mocha */
import { cleanupRoles } from '../cleanupRoles'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import {
  mockCollection,
  clearCollection,
  restoreCollection
} from '../../../../tests/mockCollection'
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

  afterEach(async () => {
    await clearCollection({ collection: Meteor.users })
    await clearCollection({ collection: Meteor.roleAssignment })
  })

  it('removes roles for which no users exist anymore', async () => {
    await Meteor.users.insertAsync({ _id: Random.id(), roles: ['foo', 'bar'] })

    expect(await cleanupRoles()).to.equal(0)

    Meteor.roleAssignment.insertAsync({
      user: {
        _id: Random.id()
      }
    })

    expect(await Meteor.roleAssignment.countDocuments({})).to.equal(1)
    expect(await cleanupRoles()).to.equal(1)
    expect(await Meteor.roleAssignment.countDocuments({})).to.equal(0)
  })
})
