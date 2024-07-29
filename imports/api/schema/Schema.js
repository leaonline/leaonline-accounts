import { Tracker } from 'meteor/tracker'
import SimpleSchema from 'meteor/aldeed:simple-schema'

SimpleSchema.extendOptions(['autoform'])

export const Schema = {}

Schema.create = function (definitions, options) {
  return new SimpleSchema(definitions, Object.assign({ tracker: Tracker }, options))
}

export const ErrorTypes = SimpleSchema.ErrorTypes

export const RegEx = SimpleSchema.RegEx

export const Integer = SimpleSchema.Integer
