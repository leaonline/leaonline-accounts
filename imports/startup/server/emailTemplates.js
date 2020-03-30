import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const settings = Meteor.settings.emailTemplates

Accounts.emailTemplates.siteName = settings.siteName
Accounts.emailTemplates.from = settings.from

Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Welcome to ${settings.siteName}`
}

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  const cleanUrl = url.replace('/#/','/')
  if (Meteor.isDevelopment) {
    console.log('enrollAccount', user, cleanUrl)
  }
  return 'You have been selected to participate in building a better future!'
    + ' To activate your account, simply click the link below:\n\n'
    + cleanUrl
}

Accounts.emailTemplates.verifyEmail.subject = (user) => {
  return `Verify your ${settings.siteName} account now!`
}

Accounts.emailTemplates.verifyEmail.text = (user, url) => {
  if (Meteor.isDevelopment) {
    console.log('verifyEmail', user, url)
  }
  return `Hey ${user}! Verify your e-mail by following this link: ${url}`
}

Accounts.emailTemplates.resetPassword.subject = (user) => {
  return `Reset your ${settings.siteName} password`
}

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  if (Meteor.isDevelopment) {
    console.log('resetPassword', user, url)
  }
  return `Hello ${user}! You can reset your ${settings.siteName} password via the following link: ${url}`
}
