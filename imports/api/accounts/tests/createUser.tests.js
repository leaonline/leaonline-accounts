/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { stub, restoreAll, expectThrow } from '../../../../tests/testUtils.tests'
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
  it('throws on incomplete params', async () => {
    delete userDoc.username
    const docs = [undefined, {}]
    for (const doc of docs) {
      await expectThrow({
        fn: () => createUser(doc),
        message: 'Missing key \'email\''
      })
    }

    delete userDoc.institution
    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'Missing key \'institution\''
    })

    delete userDoc.lastName
    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'Missing key \'lastName\''
    })

    delete userDoc.firstName
    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'Missing key \'firstName\''
    })
  })
  it('throws if email alredy exists', async () => {
    stub(Accounts, 'findUserByEmail', async () => true)
    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'createUser.userExists'
    })
  })
  it('throws if username already exists', async () => {
    stub(Accounts, 'findUserByEmail', async () => false)
    stub(Accounts, 'findUserByUsername', async () => true)
    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'createUser.userExists'
    })
  })
  it('throws if user profile is not updated', async () => {
    stub(Accounts, 'findUserByEmail', async () => false)
    stub(Accounts, 'findUserByUsername', async () => false)
    stub(Accounts, 'createUserAsync', async () => userId)
    stub(Meteor.users, 'updateAsync', async () => 0)

    await expectThrow({
      fn: () => createUser(userDoc),
      message: 'createUser.updateFailed'
    })
  })
  it('creates a new user', async () => {
    stub(Accounts, 'findUserByEmail', async () => false)
    stub(Accounts, 'findUserByUsername', async () => false)
    stub(Accounts, 'createUserAsync', async () => userId)
    stub(Meteor.users, 'updateAsync', async () => 1)
    expect(await createUser(userDoc)).to.equal(userId)

    delete userDoc.username
    expect(await createUser(userDoc)).to.equal(userId)
  })
})
