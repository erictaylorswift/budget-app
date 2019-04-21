import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Toasted from 'vue-toasted'
import 'material-icons/iconfont/material-icons.css'
import './assets/scss/app.scss'
import router from './router'
import { store } from './store/store.js'
import VCalendar from 'v-calendar'
import lodash from 'lodash'
import { auth } from './firebaseConfig'

Vue.config.productionTip = false

Vue.use(lodash)
Vue.use(Toasted)
Vue.use(VCalendar, {
  firstDayOfWeek: 2,
  componentPrefix: 'vc'
})

let successToastOptions = {
  type: 'success',
  fitToScreen: true,
  duration: 5000,
  position: 'top-center',
  theme: 'bubble'
}

let errorToastOptions = {
  type: 'error',
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

Vue.toasted.register(
  'error',
  payload => {
    if (!payload.message) {
      return 'Error'
    }

    return payload.message
  },
  errorToastOptions
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
