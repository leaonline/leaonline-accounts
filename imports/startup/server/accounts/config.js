import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const { config } = Meteor.settings.accounts
Accounts.config(config)
