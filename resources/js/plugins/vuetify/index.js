import { createVuetify } from 'vuetify'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
// eslint-disable-next-line import/no-unresolved
import '@core-scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default createVuetify({
  defaults,
  icons,
  theme,
})
