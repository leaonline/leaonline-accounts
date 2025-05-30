/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { removeRole } from './removeRole'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { restoreAll, stub, expectThrow } from '../../../tests/testUtils.tests'

describe(removeRole.name, () => {
	let userId
	let role
	let institution

	beforeEach(() => {
		userId = Random.id()
		role = Random.id()
		institution = Random.id()
	})

	afterEach(() => {
		restoreAll()
	})

	it('throws if role does not exist', async () => {
		await expectThrow({
			fn: () => removeRole(userId, role, institution),
			message: 'removeRole.unknownRole',
		})
	})
	it('throws if user does not exist', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		await expectThrow({
			fn: () => removeRole(userId, role, institution),
			message: 'removeRole.unknownUser',
		})
	})
	it('throws if user has not role', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		stub(Meteor.users, 'countDocuments', async () => 1)
		stub(Roles, 'userIsInRoleAsync', () => false)
		await expectThrow({
			fn: () => removeRole(userId, role, institution),
			message: 'removeRole.roleNotAssigned',
		})
	})
	it('throws if the role has not been removed', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		stub(Meteor.users, 'countDocuments', async () => 1)
		stub(Roles, 'removeUsersFromRolesAsync', () => true)
		stub(Roles, 'userIsInRoleAsync', () => true)
		await expectThrow({
			fn: () => removeRole(userId, role, institution),
			message: 'removeRole.roleNotRemoved',
		})
	})
	it('removes the role from user', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		stub(Meteor.users, 'countDocuments', async () => 1)
		stub(Roles, 'removeUsersFromRolesAsync', () => true)
		let count = 0
		stub(Roles, 'userIsInRoleAsync', () => !count++)
		expect(await removeRole(userId, role, institution)).to.equal(true)
	})
})
