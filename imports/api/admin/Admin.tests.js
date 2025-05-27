/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { expectThrow, restoreAll, stub } from '../../../tests/testUtils.tests'
import { Admin } from './Admin'
import {
	clearCollection,
	mockCollection,
	restoreCollection,
} from '../../../tests/mockCollection'

describe('Admin', () => {
	describe('methods', () => {
		let userId
		let env

		before(() => {
			Meteor.users = mockCollection({
				name: 'users',
				collection: Meteor.users,
			})
		})

		after(() => {
			Meteor.users = restoreCollection({ name: 'users' })
		})

		beforeEach(() => {
			userId = Random.id()
			env = { userId, debug: () => {} }
		})

		afterEach(async () => {
			restoreAll()
			await clearCollection({ collection: Meteor.users })
		})

		describe(Admin.methods.getUsers.name, () => {
			const run = Admin.methods.getUsers.run

			it('returns all users, except self', async () => {
				const users = [{ _id: Random.id() }, { _id: Random.id() }]
				expect(await run.call(env)).to.deep.equal([])
				for (const doc of users) {
					await Meteor.users.insertAsync(doc)
				}
				expect(await run.call(env)).to.deep.equal(users)
			})
			it('returns a specific set of users', async () => {
				const ids = [Random.id(), Random.id()]
				const users = [{ _id: ids[0] }, { _id: ids[1] }]
				expect(await run.call(env)).to.deep.equal([])
				for (const doc of users) {
					await Meteor.users.insertAsync(doc)
				}
				expect(await run.call(env, { ids })).to.deep.equal([
					{ _id: ids[0] },
					{ _id: ids[1] },
				])
			})
		})
		describe(Admin.methods.createUser.name, () => {
			const run = Admin.methods.createUser.run

			it('creates a new user with given credentials', async () => {
				const userDoc = {
					email: `${Random.id(8)}@example.com`,
					firstName: Random.id(8),
					lastName: Random.id(8),
					institution: Random.id(8),
					roles: ['admin', 'foo', 'bar'],
				}
				stub(Accounts, 'findUserByEmail', async () => false)
				stub(Accounts, 'findUserByUsername', async () => false)
				stub(Accounts, 'createUserAsync', async () => userId)
				stub(Accounts, 'sendEnrollmentEmail', async () => {})
				stub(Meteor.users, 'updateAsync', async () => 1)
				stub(Meteor.users, 'countDocuments', async () => 1)
				stub(Meteor.roles, 'countDocuments', async () => 1)
				stub(Roles, 'addUsersToRolesAsync', () => true)
				stub(Roles, 'userIsInRoleAsync', () => true)
				expect(await run.call(env, userDoc)).to.equal(userId)
				expect(userDoc.roles).to.deep.equal(['foo', 'bar'])
			})
		})
		describe(Admin.methods.updateUser.name, () => {
			const run = Admin.methods.updateUser.run
			it('throws if the user does not exist', async () => {
				await expectThrow({
					fn: () => run.call(env),
					message: 'errors.docNotFound',
				})
				await expectThrow({
					fn: () => run.call(env, { _id: userId }),
					message: 'errors.docNotFound',
				})
			})
			it('throws if the user is an admin', async () => {
				const user = { _id: userId, roles: ['admin'] }
				stub(Meteor.users, 'findOneAsync', () => user)
				await expectThrow({
					fn: () => run.call(env, { _id: userId }),
					message: 'admin.noUpdateOnAdmin',
				})
			})
			it('throws if the admin role is to be assigned to non-admin', async () => {
				const user = { _id: userId, roles: ['foo'] }
				stub(Meteor.users, 'findOneAsync', () => user)
				await expectThrow({
					fn: () => run.call(env, { _id: userId, roles: ['admin'] }),
					message: 'admin.noLifting',
				})
			})

			it('updates the doc accordingly')
		})
		describe(Admin.methods.removeUser.name, () => {
			const run = Admin.methods.removeUser.run
			it('throws if the user does not exist', async () => {
				await expectThrow({
					fn: () => run.call(env),
					message: 'errors.docNotFound',
				})
				await expectThrow({
					fn: () => run.call(env, { userId }),
					message: 'errors.docNotFound',
				})
			})
			it('throws if the user is an admin', async () => {
				const user = { _id: userId, roles: ['admin'] }
				stub(Meteor.users, 'findOneAsync', () => user)
				await expectThrow({
					fn: () => run.call(env, { userId }),
					message: 'admin.noUpdateOnAdmin',
				})
			})
			it('deletes the user roles')
			it('deletes the user')
		})
	})
})
