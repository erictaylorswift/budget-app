import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import Datepicker from 'vuejs-datepicker'
import Toasted from 'vue-toasted'
import VueMaterial from 'vue-material'
import SmartTable from 'vuejs-smart-table';
import 'vue-material/dist/vue-material.min.css'
import './../node_modules/bulma/css/bulma.css';
import './assets/scss/app.scss'
import router from './router'
import { store } from './store.js'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

Vue.config.productionTip = false

Vue.use(VModal)
Vue.use(Datepicker)
Vue.use(Toasted)
Vue.use(VueMaterial)
Vue.use(SmartTable)
Vue.use(VCalendar, {
  firstDayOfWeek: 2,
  paneWidth: 600
})


new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})
