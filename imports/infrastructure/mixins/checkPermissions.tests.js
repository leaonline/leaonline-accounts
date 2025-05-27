/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { checkPermissions } from './checkPermissions'
import { stub, restoreAll, expectThrow } from '../../../tests/testUtils.tests'
import { Roles } from 'meteor/alanning:roles'

describe(checkPermissions.name, () => {
	afterEach(() => {
		restoreAll()
	})

	it('skips if isPublic flag is set', async () => {
		const value = Random.id()
		const options = {
			isPublic: true,
			run: () => value,
		}

		const updatedOptions = checkPermissions(options)
		expect(await updatedOptions.run()).to.equal(value)
	})
	it('runs the function if there is a user with roles', async () => {
		let userCalled = false
		const user = { _id: Random.id() }
		stub(Meteor.users, 'findOneAsync', async () => {
			userCalled = true
			return user
		})
		stub(Roles, 'userIsInRoleAsync', async () => true)
		const value = Random.id()
		const options = {
			roles: ['foo'],
			run: () => value,
		}

		const updatedOptions = checkPermissions(options)
		expect(await updatedOptions.run.call({ userId: Random.id() })).to.equal(
			value,
		)
		expect(userCalled).to.equal(true)
	})
	it('throws if there is no logged in user', async () => {
		stub(Meteor.users, 'findOneAsync', async () => undefined)
		const options = {
			roles: ['foo'],
			run: () => {
				throw new Error('unexpected call')
			},
		}

		const updatedOptions = checkPermissions(options)
		await expectThrow({
			fn: () => updatedOptions.run(),
			message: 'errors.insufficientPrivileges',
		})
	})
	it('throws if the user is not in roles', async () => {
		let userCalled = false
		const user = { _id: Random.id() }
		stub(Meteor.users, 'findOneAsync', async () => {
			userCalled = true // should not be called
			return user
		})
		stub(Roles, 'userIsInRoleAsync', async () => false)
		const value = Random.id()
		const options = {
			roles: ['foo'],
			run: () => value,
		}

		const updatedOptions = checkPermissions(options)
		await expectThrow({
			fn: () => updatedOptions.run(),
			message: 'errors.insufficientPrivileges',
		})
		expect(userCalled).to.equal(false)
	})
})
