import { Meteor } from 'meteor/meteor'
import { i18n } from '../../i18n/i18n'
import { ErrorTypes, RegEx } from '../../schema/Schema'

const { min, max, blacklist, icon } = Meteor.settings.public.password
const createBlacklist = (list) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regexes = list.map(entry => new RegExp(entry.trim().toLowerCase(), 'i'))
  const test = (value) => value && !regexes.some(regExp => regExp.test(value))
  const message = (value) => i18n.get('password.guess', { password: value })
  return { test, message }
}

export const getResetPasswordSchema = (email) => {
  const list = [...blacklist]
  if (email) {
    const split = email.toLowerCase().split('@')
    list.push(split[0])

    const domain = split[1].split('.')
    list.push(domain[0])
  }

  const rules = [
    {
      test: value => value && value.length >= min,
      message: () => i18n.get('password.min', { min })
    },
    {
      test: value => value && value.length <= max,
      message: () => i18n.get('password.max', { max })
    },
    createBlacklist(list)
  ]

  return {
    email: {
      type: String,
      label: false,
      optional: true,
      regEx: RegEx.EmailWithTLD,
      autoform: { type: 'email', class: 'd-none', defaultValue: email }
    },
    password: {
      type: String,
      label: () => i18n.get('user.password'),
      autoform: {
        type: 'password2',
        rules: rules,
        autocomplete: true,
        autofocus: true,
        userIcon: icon
      },
      custom () {
        const isUnset = (!this.isSet || !this.value)
        const value = this.value

        // check optional
        if (isUnset) {
          return ErrorTypes.REQUIRED
        }

        if (rules) {
          let failedRule
          const passed = rules.every(rule => {
            if (!rule.test(value)) {
              failedRule = rule
              return false
            }
            return true
          })

          if (!passed) {
            return failedRule.message(value)
          }
        }
      }
    }
  }
}
