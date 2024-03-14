import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Admin } from '../../api/admin/Admin'
import { ReactiveDict } from 'meteor/reactive-dict'
import { callMethod } from '../utils/callMethod'
import { toSerializedError } from '../utils/toSerializedError'
import { formIsValid } from '../utils/formIsValid'
import { Schema } from '../../api/schema/Schema'
import { createUserSchema } from '../../api/accounts/schema/createUserSchema'
import '../oauth/login/login'
import './admin.html'

Template.admin.onCreated(function () {
  const instance = this
  instance.userSchema = Schema.create(createUserSchema)
  instance.state = new ReactiveDict()
  instance.users = new Mongo.Collection(null)
  instance.success = () => {
    window.alert('successful')
    instance.state.set({ error: null })
  }
  instance.fetchUsers = ({ ids } = {}) => {
    const args = {}
    if (ids) args.ids = ids

    callMethod({
      name: Admin.methods.getUsers,
      args,
      failure: err => instance.state.set({ error: toSerializedError(err) }),
      success: users => {
        users.forEach(user => {
          user.email = user.emails[0].address
          user.verified = user.emails[0].verified
          instance.users.upsert(user._id, { $set: user })
        })
      }
    })
  }

  instance.autorun(computation => {
    const currentUser = Meteor.user()
    if (!currentUser) { return }

    // TODO check if user is admin or skip already here
    if (!currentUser.roles.includes('admin')) {
      return instance.state.set({
        error: toSerializedError(new Meteor.Error('errors.permissionDenied', 'roles.notAdmin'))
      })
    }

    instance.fetchUsers()
    computation.stop()
  })
})

const userSort = { lastName: 1, firstName: 1 }
Template.admin.helpers({
  users () {
    return Template.instance().users.find({}, { sort: userSort })
  },
  error () {
    return Template.instance().state.get('error')
  },
  userForm () {
    return Template.instance().state.get('userForm')
  },
  userSchema () {
    return Template.instance().userSchema
  }
})

Template.admin.events({
  'click .user-btn' (event, templateInstance) {
    event.preventDefault()
    const userId = event.currentTarget.getAttribute('data-user')
    const type = event.currentTarget.getAttribute('data-type')

    if (type === 'cancel') {
      return templateInstance.state.set({ userForm: null })
    }

    if (type === 'remove') {
      if (!window.confirm('remove?')) { return }

      return callMethod({
        name: Admin.methods.removeUser,
        args: { userId },
        failure: err => templateInstance.state.set({ error: toSerializedError(err) }),
        success: () => {
          templateInstance.users.remove({ _id: userId })
          templateInstance.success()
        }
      })
    }

    const doc = userId
      ? templateInstance.users.findOne(userId)
      : undefined
    const userForm = { type, doc, userId }
    templateInstance.state.set({ userForm })
  },
  'submit #userForm' (event, templateInstance) {
    event.preventDefault()
    const { type, userId } = templateInstance.state.get('userForm')
    const insertDoc = formIsValid('userForm', templateInstance.userSchema, false)
    if (!insertDoc) { return }

    const isCreateForm = type === 'create'

    if (isCreateForm) {
      callMethod({
        name: Admin.methods.createUser,
        args: insertDoc,
        failure: err => templateInstance.state.set({ error: toSerializedError(err) }),
        success: newUserId => {
          templateInstance.fetchUsers({ ids: [newUserId] })
          templateInstance.state.set('userForm', null)
          templateInstance.success()
        }
      })
    }

    else {
      insertDoc._id = userId
      callMethod({
        name: Admin.methods.updateUser,
        args: insertDoc,
        failure: err => templateInstance.state.set({ error: toSerializedError(err) }),
        success: () => {
          templateInstance.fetchUsers({ ids: [userId] })
          templateInstance.state.set('userForm', null)
          templateInstance.success()
        }
      })
    }
  }
})
