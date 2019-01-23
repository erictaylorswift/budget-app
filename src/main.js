import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import './assets/scss/app.scss'
import router from './router'
import { store } from './store.js'

Vue.config.productionTip = false

Vue.use(VModal)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})
