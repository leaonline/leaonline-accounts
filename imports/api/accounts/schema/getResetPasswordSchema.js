import { i18n } from '../../i18n/i18n'

export const getResetPasswordSchema = () => ({
  password: {
    type: String,
    label: () => i18n.get('user.password'),
    autoform: {
      type: 'password2'
    }
  },
  confirm: {
    type: String,
    label: () => i18n.get('user.confirmPassword'),
    autoform: {
      type: 'password2'
    },
    custom () {
      if (!this.isSet || !this.value) return false
      const pwField = AutoForm.getFieldValue('password')
      return this.value === pwField
    }
  },
})