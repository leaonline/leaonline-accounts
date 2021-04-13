/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { stub, restoreAll, overrideStub } from '../../../tests/testUtils.tests'
import { OAuth } from './OAuth'

describe('OAuth', function () {
  describe(OAuth.getClientKey.name, function () {
    it('returns no client key, if not defined in settings', function () {
      expect(OAuth.getClientKey(Random.id())).to.equal(undefined)
    })
    it('returns all keys for clients in settings', function () {
      if (!Meteor.settings.oauth?.clients?.length) {
        expect.fail()
      }

      Meteor.settings.oauth.clients.forEach(({ clientId, key }) => {
        if (!clientId || !key) expect.fail()
        expect(OAuth.getClientKey(clientId)).to.equal(key)
      })
    })
  })
  describe(OAuth.getIdentity.name, function () {
    afterEach(function () {
      restoreAll()
    })
    it('returns undefined if no user is found', function () {
      stub(Meteor.users, 'findOne', () => {})
      expect(OAuth.getIdentity()).to.equal(undefined)
      expect(OAuth.getIdentity(Random.id())).to.equal(undefined)

      overrideStub(Meteor.users, 'findOne', () => ({}))
      expect(OAuth.getIdentity()).to.equal(undefined)
    })
    it('returns a valid identity', function () {
      const user = {
        _id: Random.id(6),
        username: Random.id(6),
        firstName: Random.id(6),
        lastName: Random.id(6),
        emails: [{ address: [Random.id(6)] }]
      }
      stub(Meteor.users, 'findOne', () => user)
      const result = OAuth.getIdentity(Random.id())
      expect(result).to.deep.equal({
        id: user._id,
        login: user.username,
        email: user.emails?.[0]?.address,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`
      })
    })
  })
})
