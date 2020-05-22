import { Meteor } from 'meteor/meteor'

const { oauth } = Meteor.settings.public

export const Routes = {}

const _routes = {}

_routes.authorize = {
  template: 'authorize',
  path: () => oauth.dialogUrl,
  label: 'Authorize',
  isPage: true,
  include () {
    return import('../../ui/oauth/authorize/authorize')
  },
  layout: 'authLayout'
}

_routes.enrol = {
  path: (token = ':token') => `/enroll-account/${token}`,
  template: 'enroll',
  label: 'pages.enroll.title',
  isPage: true,
  include () {
    return import('../../ui/accounts/enroll/enroll')
  }
}

_routes.resetPassword = {
  path: (token = ':token') => `/reset-password/${token}`,
  template: 'resetPassword',
  label: 'pages.resetPassword.title',
  isPage: true,
  include () {
    return import('../../ui/accounts/resetPassword/resetPassword')
  }
}

Routes.all = function () {
  return Object.assign({}, _routes)
}

Routes.each = function (fn) {
  Routes.toArray().forEach(fn)
}

Routes.toArray = function () {
  const all = Routes.all()
  return Object.values(all)
}

Object.assign(Routes, _routes)
