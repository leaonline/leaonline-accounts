/* eslint-env mocha */
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { Roles } from 'meteor/alanning:roles'
import { canUserAccessClient } from './canUserAccessClient'
import { restoreAll, stub } from '../../../tests/testUtils.tests'

describe(canUserAccessClient.name, () => {
	let user
	let client
	beforeEach(() => {
		user = { _id: Random.id() }
		client = { clientId: Random.id() }
	})
	afterEach(() => {
		restoreAll()
	})
	it('returns false if the user or client are not defined', async () => {
		expect(await canUserAccessClient({})).to.equal(false)
		expect(await canUserAccessClient({ user })).to.equal(false)
		expect(await canUserAccessClient({ client })).to.equal(false)
	})
	it('returns false if the user has not the clientKey as role', async () => {
		stub(Roles, 'userIsInRoleAsync', () => false)
		expect(await canUserAccessClient({ client, user })).to.equal(false)
	})
	it('returns true if the user has the clientKey as role', async () => {
		stub(Roles, 'userIsInRoleAsync', () => true)
		expect(await canUserAccessClient({ client, user })).to.equal(true)
	})
})
