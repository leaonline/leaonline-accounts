import { Tracker } from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'

SimpleSchema.extendOptions([ 'autoform' ])

export const Schema = {}

Schema.create = function (definitions, options) {
  return new SimpleSchema(definitions, Object.assign({ tracker: Tracker }, options))
}
