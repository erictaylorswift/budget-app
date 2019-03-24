<template>
  <div id="login" class="is-fullheight">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <div class="columns is-fullheight is-fullwidth">
      <div class="column has-background-warning">
        <div class="has-text-centered welcome">
          <h1 class="title is-1">Welcome to Budgie</h1>
          <img src="..\..\assets\images\budgie.png" alt="budgie" />
        </div>
      </div>
      <div class="column sign-in">
        <div class="tabs is-medium">
          <ul>
            <li v-bind:class="{ 'is-active': this.view == 'Login' }">
              <a @click="switchView('Login')">Sign in</a>
            </li>
            <li v-bind:class="{ 'is-active': this.view == 'CreateAccount' }">
              <a @click="switchView('CreateAccount')">Create account</a>
            </li>
          </ul>
        </div>
        <component v-bind:is="view"></component>
      </div>
    </div>
  </div>
</template>

<script>
import Login from './Login'
import CreateAccount from './CreateAccount'
const fb = require('../../firebaseConfig')

export default {
  components: {
    Login,
    CreateAccount
  },
  data() {
    return {
      view: 'Login'
    }
  },
  methods: {
    switchView(name) {
      this.view = name
    }
  }
}
</script>
