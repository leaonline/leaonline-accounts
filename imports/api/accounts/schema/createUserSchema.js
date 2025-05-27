import { RegEx } from '../../schema/Schema'

export const createUserSchema = {
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	institution: {
		type: String,
	},
	email: {
		type: String,
		regEx: RegEx.EmailWithTLD,
	},
	username: {
		type: String,
		optional: true,
	},
	roles: {
		type: Array,
		minCount: 1,
	},
	'roles.$': {
		type: String,
		allowedValues: ['admin', 'backend', 'content', 'otulea', 'teacher'],
	},
}
