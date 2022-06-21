/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { checkPermissions } from './checkPermissions'
import { stub, restoreAll } from '../../../tests/testUtils.tests'
import { Roles } from 'meteor/alanning:roles'

describe(checkPermissions.name, function () {
  afterEach(function () {
    restoreAll()
  })

  it('skips if isPublic flag is set', function () {
    const value = Random.id()
    const options = {
      isPublic: true,
      run: () => value
    }

    const updatedOptions = checkPermissions(options)
    expect(updatedOptions.run()).to.equal(value)
  })
  it('runs the function if there is a user with roles', function () {
    let userCalled = false
    const user = { _id: Random.id() }
    stub(Meteor.users, 'findOne', () => {
      userCalled = true
      return user
    })
    stub(Roles, 'userIsInRole', () => true)
    const value = Random.id()
    const options = {
      roles: ['foo'],
      run: () => value
    }

    const updatedOptions = checkPermissions(options)
    expect(updatedOptions.run.call({ userId: Random.id() })).to.equal(value)
    expect(userCalled).to.equal(true)
  })
  it('throws if there is no logged in user', function () {
    stub(Meteor.users, 'findOne', () => undefined)
    const options = {
      roles: ['foo'],
      run: () => {
        throw new Error('unexpected call')
      }
    }

    const updatedOptions = checkPermissions(options)
    expect(() => updatedOptions.run()).to.throw('errors.insufficientPrivileges')
  })
  it('throws if the user is not in roles', function () {
    let userCalled = false
    const user = { _id: Random.id() }
    stub(Meteor.users, 'findOne', () => {
      userCalled = true // should not be called
      return user
    })
    stub(Roles, 'userIsInRole', () => false)
    const value = Random.id()
    const options = {
      roles: ['foo'],
      run: () => value
    }

    const updatedOptions = checkPermissions(options)
    expect(() => updatedOptions.run()).to.throw('errors.insufficientPrivileges')
    expect(userCalled).to.equal(false)
  })
})
