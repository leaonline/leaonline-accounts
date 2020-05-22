import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const { config } = Meteor.settings.accounts
Accounts.config(config)

Meteor.publish(null, function () {
  if (!this.userId) return this.ready()
  return Meteor.users.find({ _id: this.userId }, { fields: { services: 0 } })
})