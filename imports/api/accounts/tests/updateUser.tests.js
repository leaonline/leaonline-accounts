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
import { Roles } from 'meteor/alanning:roles'

describe(updateUser.name, function () {
  before(async function () {
    Meteor.users = mockCollection({
      name: 'users',
      collection: Meteor.users
    })
    await Roles.createRoleAsync('foo')
    await Roles.createRoleAsync('bar')
  })

  after(async () => {
    Meteor.users = restoreCollection({ name: 'users' })
    await Roles.deleteRoleAsync('foo')
    await Roles.deleteRoleAsync('bar')
  })

  let userId
  let currentUser

  beforeEach(async () => {
    userId = await Meteor.users.insertAsync({
      firstName: Random.id(),
      lastName: Random.id(),
      roles: []
    })
    currentUser = await Meteor.users.findOneAsync(userId)
  })

  afterEach(async () => {
    await clearCollection({ collection: Meteor.users })
    await clearCollection({ collection: Meteor.roleAssignment })
  })

  it('does nothing if nothing changes', async () => {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: currentUser.roles
    }

    const updated = await updateUser(config, currentUser)
    expect(updated).to.equal(0)

    const updatedUser = await Meteor.users.findOneAsync(userId)
    expect(updatedUser).to.deep.equal(currentUser)
  })
  it('updates firstName if different', async () => {
    const config = {
      firstName: 'foo',
      lastName: currentUser.lastName,
      roles: currentUser.roles
    }

    const updated = await updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = await Meteor.users.findOneAsync(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: 'foo',
      lastName: currentUser.lastName,
      roles: []
    })
  })
  it('updates lastName if different', async () => {
    const config = {
      firstName: currentUser.firstName,
      lastName: 'foo',
      roles: currentUser.roles
    }

    const updated = await updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = await Meteor.users.findOneAsync(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: 'foo',
      roles: []
    })
  })
  it('adds new roles', async () => {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    }

    const updated = await updateUser(config, currentUser)
    expect(updated).to.equal(1)

    const updatedUser = await Meteor.users.findOneAsync(userId)
    expect(updatedUser).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles.push('bar')
    const updated2 = await updateUser(config, updatedUser)
    expect(updated2).to.equal(1)

    const updatedUser2 = await Meteor.users.findOneAsync(userId)
    expect(updatedUser2).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['bar', 'foo']
    })

    expect(await hasRole(userId, ['foo', 'bar'])).to.equal(true)
  })
  it('removes roles', async () => {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo', 'bar']
    }

    await updateUser(config, currentUser)
    let userDoc = await Meteor.users.findOneAsync(userId)
    expect(userDoc).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['bar', 'foo']
    })

    config.roles.pop()
    await updateUser(config, userDoc)
    userDoc = await Meteor.users.findOneAsync(userId)
    expect(userDoc).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles.pop()
    await updateUser(config, userDoc)

    userDoc = await Meteor.users.findOneAsync(userId)
    expect(userDoc).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: []
    })
  })
  it('updates multiple values at once', async () => {
    const config = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    }
    await updateUser(config, currentUser)

    expect(await Meteor.users.findOneAsync(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['foo']
    })

    config.roles = ['bar']
    config.firstName = 'John'
    config.lastName = 'Doe'

    await updateUser(config, currentUser)

    expect(await Meteor.users.findOneAsync(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: 'John',
      lastName: 'Doe',
      roles: ['bar']
    })
  })
  it('migrates roles if institution has changed', async () => {
    await Meteor.users.updateAsync(userId, { $set: { institution: 'inst', roles: ['foo', 'bar'] } })

    expect(await Meteor.users.findOneAsync(userId)).to.deep.equal({
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
    await updateUser(config, currentUser)

    expect(await Meteor.users.findOneAsync(userId)).to.deep.equal({
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      roles: ['bar', 'foo'],
      institution: 'inst-foo'
    })
  })
})
