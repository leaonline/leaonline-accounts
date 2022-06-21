/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { stub, restoreAll } from '../../../../tests/testUtils.tests'
import { createUser } from '../createUser'

describe(createUser.name, function () {
  let userDoc
  let userId
  beforeEach(function () {
    userId = Random.id()
    userDoc = {
      email: `${Random.id(8)}@example.com`,
      firstName: Random.id(8),
      lastName: Random.id(8),
      institution: Random.id(8),
      username: Random.id(8)
    }
  })
  afterEach(function () {
    restoreAll()
  })
  it('throws on incomplete params', function () {
    delete userDoc.username
    ;[undefined, {}].forEach(doc => {
      expect(() => createUser(doc)).to.throw('Missing key \'email\'')
    })

    delete userDoc.institution
    expect(() => createUser(userDoc)).to.throw('Missing key \'institution\'')

    delete userDoc.lastName
    expect(() => createUser(userDoc)).to.throw('Missing key \'lastName\'')

    delete userDoc.firstName
    expect(() => createUser(userDoc)).to.throw('Missing key \'firstName\'')
  })
  it('throws if email alredy exists', function () {
    stub(Accounts, 'findUserByEmail', () => true)
    expect(() => createUser(userDoc)).to.throw('createUser.userExists')
  })
  it('throws if username already exists', function () {
    stub(Accounts, 'findUserByEmail', () => false)
    stub(Accounts, 'findUserByUsername', () => true)
    expect(() => createUser(userDoc)).to.throw('createUser.userExists')
  })
  it('throws if user profile is not updated', function () {
    stub(Accounts, 'findUserByEmail', () => false)
    stub(Accounts, 'findUserByUsername', () => false)
    stub(Accounts, 'createUser', () => userId)
    stub(Meteor.users, 'update', () => 0)
    expect(() => createUser(userDoc)).to.throw('createUser.updateFailed')
  })
  it('creates a new user', function () {
    stub(Accounts, 'findUserByEmail', () => false)
    stub(Accounts, 'findUserByUsername', () => false)
    stub(Accounts, 'createUser', () => userId)
    stub(Meteor.users, 'update', () => 1)
    expect(createUser(userDoc)).to.equal(userId)

    delete userDoc.username
    expect(createUser(userDoc)).to.equal(userId)
  })
})
