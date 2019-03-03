import Vue from 'vue'
import App from './App.vue'
import Datepicker from 'vuejs-datepicker'
import Toasted from 'vue-toasted'
import VueMaterial from 'vue-material'
import SmartTable from 'vuejs-smart-table';
import 'vue-material/dist/vue-material.min.css'
import './assets/scss/app.scss'
import router from './router'
import { store } from './store.js'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import 'bulma/css/bulma.css'
import lodash from 'lodash'

Vue.config.productionTip = false

Vue.use(lodash)
Vue.use(Datepicker)
Vue.use(Toasted)
Vue.use(VueMaterial)
Vue.use(SmartTable)
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})


new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})
