import { Templat } from 'meteor/templating'
import { i18n } from '../../api/i18n/i18n'
import i18nDE from '../../../resources/i18n/de/i18n_de'
import i18nConfig from '../../../resources/i18n/de/i18n_config_de'

i18n.load({
  settings: i18nConfig,
  de: i18nDE
})


Template.registerHelper('i18n', function (...args) {
  args.pop()
  return i18n.get.apply(null, args)
})
