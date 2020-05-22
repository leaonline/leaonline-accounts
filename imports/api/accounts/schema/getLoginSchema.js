import { i18n } from '../../i18n/i18n'

export const getLoginSchema = () => ({
  email: {
    type: String,
    label: () => i18n.get('user.email'),
    autoform: {
      type: 'email'
    }
  },
  password: {
    type: String,
    label: () => i18n.get('user.password'),
    autoform: {
      type: 'password'
    }
  }
})