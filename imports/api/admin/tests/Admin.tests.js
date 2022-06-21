/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { restoreAll, stub } from '../../../../tests/testUtils.tests'
import { Admin } from '../Admin'
import { Accounts } from "meteor/accounts-base"
import { createUser } from '../../accounts/createUser'

describe('Admin', function () {
  describe('methods', function () {
    let userId
    let env

    beforeEach(function () {
      userId = Random.id()
      env = { userId, debug: () => {} }
    })

    afterEach(function () {
      restoreAll()
    })

    describe(Admin.methods.getUsers.name, function () {
      const run = Admin.methods.getUsers.run

      it('returns all users, except self', function () {
        const users = [{ _id: Random.id()}, { _id: Random.id()}]
        const stubUsers = (query, { fields }) => {
          expect(query).to.deep.equal({ _id: { $nin: [userId] }})
          expect(fields).to.deep.equal({ services: 0, oauth: 0 })
          return { fetch: () => users }
        }
        stub(Meteor.users, 'find', stubUsers)
        expect(run.call(env)).to.deep.equal(users)
      })
      it('returns a specific set of users', function () {
        const ids = [Random.id(), Random.id()]
        const users = [{ _id: ids[0]}, { _id: ids[1]}]
        const stubUsers = (query, { fields }) => {
          expect(query).to.deep.equal({ _id: { $nin: [userId], $in: ids }})
          expect(fields).to.deep.equal({ services: 0, oauth: 0 })
          return { fetch: () => users }
        }
        stub(Meteor.users, 'find', stubUsers)
        expect(run.call(env, { ids })).to.deep.equal([{ _id: ids[0]}, { _id: ids[1]}])
      })
    })
    describe(Admin.methods.createUser.name, function () {
      const run = Admin.methods.createUser.run
      it('creates a new user with given credentials', function () {
        const userDoc = {
          email: `${Random.id(8)}@example.com`,
          firstName: Random.id(8),
          lastName: Random.id(8),
          institution: Random.id(8),
          roles: ['admin', 'foo', 'bar']
        }
        stub(Accounts, 'findUserByEmail', () => false)
        stub(Accounts, 'findUserByUsername', () => false)
        stub(Accounts, 'createUser', () => userId)
        stub(Accounts, 'sendEnrollmentEmail', () => {})
        stub(Meteor.users, 'update', () => 1)
        stub(Meteor.users, 'find', () => ({ count: () => 1 }))
        stub(Meteor.roles, 'find', () => ({ count: () => 1 }))
        stub(Roles, 'addUsersToRoles', () => true)
        stub(Roles, 'userIsInRole', () => true)
        expect(run.call(env, userDoc)).to.equal(userId)
        expect(userDoc.roles).to.deep.equal(['foo', 'bar'])
      })
    })
    describe(Admin.methods.updateUser.name, function () {
      const run = Admin.methods.updateUser.run
      it('throws if the user does not exist', function () {
        expect(() => run.call(env)).to.throw('errors.docNotFound')
        expect(() => run.call(env, { _id: userId })).to.throw('errors.docNotFound')
      })
      it('throws if the user is an admin', function () {
        const user = { _id: userId, roles: ['admin']}
        stub(Meteor.users, 'findOne', () => user)
        expect(() => run.call(env, { _id: userId })).to.throw('admin.noUpdateOnAdmin')
      })
      it('throws if the admin role is to be assigned to non-admin', function () {
        const user = { _id: userId, roles: ['foo']}
        stub(Meteor.users, 'findOne', () => user)
        expect(() => run.call(env, { _id: userId, roles: ['admin'] })).to.throw('admin.noLifting')
      })

      it('updates the doc accordingly')
    })
    describe(Admin.methods.removeUser.name, function () {
      const run = Admin.methods.removeUser.run
      it('throws if the user does not exist', function () {
        expect(() => run.call(env)).to.throw('errors.docNotFound')
        expect(() => run.call(env, { userId })).to.throw('errors.docNotFound')
      })
      it('throws if the user is an admin', function () {
        const user = { _id: userId, roles: ['admin']}
        stub(Meteor.users, 'findOne', () => user)
        expect(() => run.call(env, { userId })).to.throw('admin.noUpdateOnAdmin')
      })
      it('deletes the user roles')
      it('deletes the user')
    })
  })
})