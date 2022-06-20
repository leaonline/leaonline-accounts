export const createUserSchema = {
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  institution: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    optional: true
  },
  roles: {
    type: Array
  },
  'roles.$': {
    type: String,
    allowedValues: ['admin', 'backend', 'content', 'otulea', 'teacher']
  }
}
