/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { assignRole } from './assignRole'
import { restoreAll, stub, expectThrow } from '../../../tests/testUtils.tests'

describe(assignRole.name, () => {
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

	it('throws if the given role is not found', async () => {
		await expectThrow({
			fn: () => assignRole(userId, role, institution),
			message: 'assignRole.unknownRole',
		})
	})
	it('throws if the given user is not found', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		await expectThrow({
			fn: () => assignRole(userId, role, institution),
			message: 'assignRole.unknownUser',
		})
	})
	it('throws if the user role is not assigned', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		stub(Meteor.users, 'countDocuments', async () => 1)
		stub(Roles, 'addUsersToRolesAsync', () => true)
		stub(Roles, 'userIsInRoleAsync', () => false)
		await expectThrow({
			fn: () => assignRole(userId, role, institution),
			message: 'assignRole.roleNotAssigned',
		})
	})
	it('returns true if the role is assigned', async () => {
		stub(Meteor.roles, 'countDocuments', async () => 1)
		stub(Meteor.users, 'countDocuments', async () => 1)
		stub(Roles, 'addUsersToRolesAsync', () => true)
		stub(Roles, 'userIsInRoleAsync', () => true)
		expect(await assignRole(userId, role, institution)).to.equal(true)
	})
})
