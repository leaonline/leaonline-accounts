/* eslint-env mocha */
import { Accounts } from 'meteor/accounts-base'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { stub, restoreAll } from '../../../tests/testUtils.tests'
import { createInviteUser } from './createInviteUser'

describe(createInviteUser.name, function () {
  let invitationDoc
  beforeEach(function () {
    invitationDoc = {
      email: `${Random.id(6)}@test.tld`,
      username: Random.id(8),
      firstName: Random.id(8),
      lastName: Random.id(8),
      institution: Random.id(8),
      roles: [Random.id(8), Random.id(8)]
    }
  })
  afterEach(function () {
    restoreAll()
  })
  it('throws on incomplete params', function () {
    [undefined, {},
      { rolesHandler: () => {} },
      { rolesHandler: () => {}, createUserHandler: () => {} },
      { rolesHandler: () => {}, errorHandler: () => {} }].forEach(handlers => {
      expect(() => createInviteUser(handlers)).to.throw('Match error: Missing key')
    })
  })
  it('returns a function to invite', function () {
    expect(createInviteUser({
      createUserHandler: () => {},
      errorHandler: () => {},
      rolesHandler: () => {}
    })).to.be.a('function')
  })
  it('throws if invitation credentials are incomplete', function () {
    const invite = createInviteUser({
      createUserHandler: () => {},
      errorHandler: () => {},
      rolesHandler: () => {}
    })

    ;[undefined, {}].forEach(doc => expect(() => invite(doc)).to.throw('Missing key'))
  })
  it('will delegate user creation', function (done) {
    stub(Accounts, 'sendEnrollmentEmail', () => {})
    const invite = createInviteUser({
      createUserHandler: ({ email, username, firstName, lastName, institution }) => {
        expect(email).to.equal(invitationDoc.email)
        expect(username).to.equal(invitationDoc.username)
        expect(firstName).to.equal(invitationDoc.firstName)
        expect(lastName).to.equal(invitationDoc.lastName)
        expect(institution).to.equal(invitationDoc.institution)
        done()
      },
      errorHandler: ({ error }) => done(error),
      rolesHandler: () => {}
    })

    invite(invitationDoc)
  })
  it('will delegate roles assignment', function (done) {
    let newUserId
    stub(Accounts, 'sendEnrollmentEmail', () => {})
    const invite = createInviteUser({
      createUserHandler: () => {
        newUserId = Random.id()
        return newUserId
      },
      errorHandler: ({ error }) => done(error),
      rolesHandler: ({ userId, roles, institution }) => {
        expect(userId).to.equal(newUserId)
        expect(roles).to.deep.equal(invitationDoc.roles)
        expect(institution).to.equal(invitationDoc.institution)
        done()
      }
    })

    invite(invitationDoc)
  })
  it('will delegate error handling on failed user creation', function (done) {
    stub(Accounts, 'sendEnrollmentEmail', () => {})
    const errorId = Random.id(8)
    const invite = createInviteUser({
      createUserHandler: () => {
        throw new Error(errorId)
      },
      rolesHandler: () => {
        done(new Error('unexpected rolesHandler'))
      },
      errorHandler: ({ userId, institution, error }) => {
        expect(userId).to.equal(undefined)
        expect(institution).to.equal(invitationDoc.institution)
        expect(error.message).to.equal(errorId)
        done()
      }
    })

    const returnValue = invite(invitationDoc)
    if (returnValue) done(new Error('unexpected complete'))
  })
  it('will delegate error handling on failed roles assigment', function (done) {
    stub(Accounts, 'sendEnrollmentEmail', () => {})
    const errorId = Random.id(8)
    let newUserId
    const invite = createInviteUser({
      createUserHandler: () => {
        newUserId = Random.id()
        return newUserId
      },
      rolesHandler: () => {
        throw new Error(errorId)
      },
      errorHandler: ({ userId, institution, error }) => {
        expect(userId).to.equal(newUserId)
        expect(institution).to.equal(invitationDoc.institution)
        expect(error.message).to.equal(errorId)
        done()
      }
    })

    const returnValue = invite(invitationDoc)
    if (returnValue) done(new Error('failed'))
  })
  it('send an email on success', function (done) {
    stub(Accounts, 'sendEnrollmentEmail', () => done())
    const invite = createInviteUser({
      createUserHandler: () => {},
      errorHandler: () => {},
      rolesHandler: () => {}
    })
    invite(invitationDoc)
  })
})
