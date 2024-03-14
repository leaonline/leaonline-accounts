import { i18n } from '../../api/i18n/i18n'
import i18nDE from '../../../resources/i18n/de/i18n_de'
import i18nConfig from '../../../resources/i18n/de/i18n_config_de'
import emailTemplatesLanguage from '../server/accounts/i18n/de'

const de = { ...i18nDE, ...emailTemplatesLanguage }

i18n.load({
  settings: i18nConfig,
  de
})
