import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Datepicker from 'vuejs-datepicker'
import Toasted from 'vue-toasted'
import SmartTable from 'vuejs-smart-table'
import 'material-icons/iconfont/material-icons.css'
import './assets/scss/app.scss'
import router from './router'
import { store } from './store/store.js'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import lodash from 'lodash'
import { auth } from './firebaseConfig'
import { BadgerAccordion, BadgerAccordionItem } from 'vue-badger-accordion'
import VueFloatLabel from 'vue-float-label'
import Fab from 'vue-fab'
import ProgressBar from 'vuejs-progress-bar'

Vue.config.productionTip = false

Vue.use(lodash)
Vue.use(Datepicker)
Vue.use(ProgressBar)
Vue.use(Fab)
Vue.use(Toasted)
Vue.use(SmartTable)
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})
Vue.use(VueFloatLabel)
Vue.component('BadgerAccordion', BadgerAccordion)
Vue.component('BadgerAccordionItem', BadgerAccordionItem)

let successToastOptions = {
  type: 'success',
  fitToScreen: true,
  duration: 5000,
  position: 'top-center',
  theme: 'bubble'
}

Vue.toasted.register(
  'success',
  payload => {
    if (!payload.message) {
      return 'Success'
    }

    return payload.message
  },
  successToastOptions
)

let app = ''

auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
