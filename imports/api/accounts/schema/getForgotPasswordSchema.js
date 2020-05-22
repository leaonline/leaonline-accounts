import { i18n } from '../../i18n/i18n'

export const getForgotPasswordSchema = () => ({
  email: {
    type: String,
    label: () => i18n.get('user.email'),
    autoform: {
      type: 'email'
    }
  }
})
