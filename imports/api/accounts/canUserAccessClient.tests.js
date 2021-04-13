/* eslint-env mocha */
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { Roles } from 'meteor/alanning:roles'
import { canUserAccessClient } from './canUserAccessClient'
import { restoreAll, stub } from '../../../tests/testUtils.tests'

describe(canUserAccessClient.name, function () {
  let user
  let client
  beforeEach(function () {
    user = { _id: Random.id() }
    client = { clientId: Random.id() }
  })
  afterEach(function () {
    restoreAll()
  })
  it('returns false if the user or client are not defined', function () {
    expect(canUserAccessClient({})).to.equal(false)
    expect(canUserAccessClient({ user })).to.equal(false)
    expect(canUserAccessClient({ client })).to.equal(false)
  })
  it('returns false if the user has not the clientKey as role', function () {
    stub(Roles, 'userIsInRole', () => false)
    expect(canUserAccessClient({ client, user })).to.equal(false)
  })
  it('returns true if the user has the clientKey as role', function () {
    stub(Roles, 'userIsInRole', () => true)
    expect(canUserAccessClient({ client, user })).to.equal(true)
  })
})
