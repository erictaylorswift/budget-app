import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import Datepicker from 'vuejs-datepicker'
import Toasted from 'vue-toasted'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import './assets/scss/app.scss'
import router from './router'
import { store } from './store.js'

Vue.config.productionTip = false

Vue.use(VModal)
Vue.use(Datepicker)
Vue.use(Toasted)
Vue.use(VueMaterial)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})
