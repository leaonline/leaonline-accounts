/* eslint-env mocha */
import { Accounts } from 'meteor/accounts-base'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { stub, restoreAll, expectThrow } from '../../../tests/testUtils.tests'
import { createInviteUser } from './createInviteUser'

describe(createInviteUser.name, () => {
	let invitationDoc
	beforeEach(() => {
		invitationDoc = {
			email: `${Random.id(6)}@test.tld`,
			username: Random.id(8),
			firstName: Random.id(8),
			lastName: Random.id(8),
			institution: Random.id(8),
			roles: [Random.id(8), Random.id(8)],
		}
	})
	afterEach(() => {
		restoreAll()
	})
	it('throws on incomplete params', async () => {
		const allHandlers = [
			undefined,
			{},
			{ rolesHandler: () => {} },
			{ rolesHandler: () => {}, createUserHandler: () => {} },
			{ rolesHandler: () => {}, errorHandler: () => {} },
		]
		for (const handlers of allHandlers) {
			await expectThrow({
				fn: () => createInviteUser(handlers),
				message: 'Match error: Missing key',
			})
		}
	})
	it('returns a function to invite', async () => {
		expect(
			createInviteUser({
				createUserHandler: () => {},
				errorHandler: () => {},
				rolesHandler: () => {},
			}),
		).to.be.a('function')
	})
	it('throws if invitation credentials are incomplete', async () => {
		const invite = createInviteUser({
			createUserHandler: () => {},
			errorHandler: () => {},
			rolesHandler: () => {},
		})
		const args = [undefined, {}]
		for (const doc of args) {
			await expectThrow({
				fn: () => invite(doc),
				message: 'Missing key',
			})
		}
	})
	it('will delegate user creation', async () => {
		stub(Accounts, 'sendEnrollmentEmail', async () => {})
		const invite = createInviteUser({
			createUserHandler: async ({
				email,
				username,
				firstName,
				lastName,
				institution,
			}) => {
				expect(email).to.equal(invitationDoc.email)
				expect(username).to.equal(invitationDoc.username)
				expect(firstName).to.equal(invitationDoc.firstName)
				expect(lastName).to.equal(invitationDoc.lastName)
				expect(institution).to.equal(invitationDoc.institution)
			},
			errorHandler: async ({ error }) => expect.fail(error?.message),
			rolesHandler: async () => {},
		})

		await invite(invitationDoc)
	})
	it('will delegate roles assignment', async () => {
		let newUserId
		stub(Accounts, 'sendEnrollmentEmail', async () => {})
		const invite = createInviteUser({
			createUserHandler: async () => {
				newUserId = Random.id()
				return newUserId
			},
			errorHandler: async ({ error }) => expect.fail(error?.message),
			rolesHandler: async ({ userId, roles, institution }) => {
				expect(userId).to.equal(newUserId)
				expect(roles).to.deep.equal(invitationDoc.roles)
				expect(institution).to.equal(invitationDoc.institution)
			},
		})

		await invite(invitationDoc)
	})
	it('will delegate error handling on failed user creation', async () => {
		stub(Accounts, 'sendEnrollmentEmail', async () => {})
		const errorId = Random.id(8)
		const invite = createInviteUser({
			createUserHandler: async () => {
				throw new Error(errorId)
			},
			rolesHandler: async () => {
				expect.fail('unexpected rolesHandler')
			},
			errorHandler: async ({ userId, institution, error }) => {
				expect(userId).to.equal(undefined)
				expect(institution).to.equal(invitationDoc.institution)
				expect(error.message).to.equal(errorId)
			},
		})

		const returnValue = await invite(invitationDoc)
		if (returnValue) expect.fail('unexpected complete')
	})
	it('will delegate error handling on failed roles assigment', async () => {
		stub(Accounts, 'sendEnrollmentEmail', async () => {})

		const errorId = Random.id(8)
		let newUserId
		const invite = createInviteUser({
			createUserHandler: async () => {
				newUserId = Random.id()
				return newUserId
			},
			rolesHandler: async () => {
				expect.fail(errorId)
			},
			errorHandler: async ({ userId, institution, error }) => {
				expect(userId).to.equal(newUserId)
				expect(institution).to.equal(invitationDoc.institution)
				expect(error.message).to.equal(errorId)
			},
		})

		const returnValue = await invite(invitationDoc)
		if (returnValue) expect.fail('failed')
	})
	it('send an email on success if no password was given', async () => {
		const emailSent = stub(Accounts, 'sendEnrollmentEmail', () => {})
		const invite = createInviteUser({
			createUserHandler: async () => {},
			errorHandler: async () => {},
			rolesHandler: async () => {},
		})
		await invite(invitationDoc)
		expect(emailSent.calledOnce).to.equal(true)
	})
	it('send no email on success if a password was given', async () => {
		stub(Accounts, 'sendEnrollmentEmail', () => expect.fail('unexpected'))
		const invite = createInviteUser({
			createUserHandler: async () => {},
			errorHandler: async () => {},
			rolesHandler: async () => {},
		})

		invitationDoc.password = 'password'
		await invite(invitationDoc)
	})
})
