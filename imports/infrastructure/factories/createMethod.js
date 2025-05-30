import { createMethodFactory } from 'meteor/leaonline:method-factory'
import { Schema } from '../../api/schema/Schema'
import { checkPermissions } from '../mixins/checkPermissions'
import { environmentExtensionMixin } from '../mixins/environmentExtensionMixin'

const schemaFactory = (definitions) => Schema.create(definitions)
const mixins = [environmentExtensionMixin, checkPermissions]

export const createMethod = createMethodFactory({ schemaFactory, mixins })
