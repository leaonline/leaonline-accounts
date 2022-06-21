/* eslint-env mocha */
import { updateUser } from '../updateUser'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import {
  mockCollection,
  clearCollection,
  restoreCollection
} from '../../../../tests/mockCollection'
import { Meteor } from 'meteor/meteor'
import { hasRole } from '../hasRole'

describe(updateUser.name, function () {
  before(function () {
    Meteor.users = mockCollection({
      name: 'users',
      collection: Meteor.users
    })
    Meteor.roleAssignment = mockCollection({
      name: 'role-assignment',
      collection: Meteor.roleAssignment
    })
    Meteor.roles = mockCollection({
      name: 'roles',
      collection: Meteor.roles
    })
  })

  after(function () {
    Meteor.users = restoreCollection({ name: 'users' })
    Meteor.roleAssignment = restoreCollection({ name: 'role-assignment' })
    Meteor.roles = restoreCollection({ name: 'roles' })
  })

  let userId
  let currentUser

  beforeEach(function () {
    userId = Meteor.users.insert({
      firstName: Random.id(),
      lastName: Random.id(),
      roles: []
    })
    currentUser = Meteor.users.findOne(userId)
    Meteor.roles.insert({ _id: 'foo', children: [] })
    Meteor.roles.insert({ _id: 'bar', children: [] })
  })

  afterEach(function () {
    clearCollection({ collection: Meteor.users })
    clearCollection({ collection: Meteor.roleAssignment })
    clearCollection({ collection: Meteor.roles })
  })

  it('does nothing if nothing changes', function () {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: currentUser.roles
    }

    const updated = updateUser(config, currentUser)
    expect(updated).to.equal(0)

    const updatedUser = Meteor.users.findOne(userId)
    expect(updatedUser).to.deep.equal(currentUser)
  })
  it('updates firstName if different', function () {
    const config = {
      firstName: 'foo',
      lastName: currentUser.lastName,
      roles: currentUser.roles
    }

    const updated = updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = Meteor.users.findOne(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: 'foo',
      lastName: currentUser.lastName,
      roles: []
    })
  })
  it('updates lastName if different', function () {
    const config = {
      firstName: currentUser.firstName,
      lastName: 'foo',
      roles: currentUser.roles
    }

    const updated = updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = Meteor.users.findOne(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: 'foo',
      roles: []
    })
  })
  it('add roles', function () {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    }

    const updated = updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = Meteor.users.findOne(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles.push('bar')
    const updated2 = updateUser(config, updatedUser)
    expect(updated2).to.equal(1)

    const updatedUser2 = Meteor.users.findOne(userId)
    expect(updatedUser2).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar']
    })

    expect(hasRole(userId, ['foo', 'bar'])).to.equal(true)
  })
  it('removes roles', function () {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar']
    }
    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar']
    })

    config.roles.pop()
    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles.pop()
    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: []
    })
  })
  it('updates multiple values at once', function () {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    }
    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles = ['bar']
    config.firstName = 'John'
    config.lastName = 'Doe'

    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: 'John',
      lastName: 'Doe',
      roles: ['bar']
    })
  })
  it('migrates roles if institution has changed', function () {
    Meteor.users.update(userId, { $set: { institution: 'inst', roles: ['foo', 'bar'] } })

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar'],
      institution: 'inst'
    })

    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar'],
      institution: 'inst-foo'
    }
    updateUser(config, currentUser)

    expect(Meteor.users.findOne(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar'],
      institution: 'inst-foo'
    })
  })
})
