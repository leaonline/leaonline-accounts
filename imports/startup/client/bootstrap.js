import '@fortawesome/fontawesome-free/js/all'
import 'bootstrap'
import popper from 'popper.js'
import { AutoFormBootstrap4 } from 'meteor/jkuester:autoform-bootstrap4'
import './theme.scss'

global.Popper = global.Popper || popper

AutoFormBootstrap4.load()
  .then(() => {
    global.AutoForm.setDefaultTemplate(AutoFormBootstrap4.template)
  })
  .catch(e => console.error(e))
