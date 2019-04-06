<template>
  <div>
    <loading :show="performingRequest"></loading>

    <v-layout row d-flex fill-height>
      <v-flex xs12 align-center class="deep-purple darken-4 is-fullheight">
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-card flat color="deep-purple darken-4">
          <v-img
            :src="budgie"
            alt="budgie_logo"
            max-width="160px"
            class="m-auto hidden-md-and-up"
          ></v-img>
          <v-card-title class="px-5" style="justify-content: center">
            <h1
              class="my-0 pt-0 text-xs-center display-3 purple--text text--accent-1 font-weight-bold"
            >
              Welcome to Budgie
            </h1>
            <p class="headline text-xs-center purple--text text--lighten-5">
              Budgie is <span class="font-italic">your </span> custom, personal
              budget manager. <br />
              Your budget, your way.
            </p>
          </v-card-title>
          <v-card-text class="m-auto text-xs-center">
            <v-btn round large @click="signUp">Sign up</v-btn>
            <v-btn outline dark round large @click="loginForm">Log in</v-btn>
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
      </v-flex>
      <v-img :src="budgie_full" min-height="100%" class="hidden-sm-and-down">
        <div class="rel_text">
          <h2
            class="display-3 text-xs-left deep-purple--text text--darken-4 mb-3"
          >
            It's your budget.
          </h2>
          <p class="subheading text-xs-left" style="width: 40%">
            Most budget apps want to tell you how to manage your budget. This
            seems annoying and makes it difficult to stay on top of your
            finances. You know your life, how you want to see you expenses
            tracked and what to name the categories.
            <strong>Budgie</strong> aims to give you the control. <br />
            <br />Add your categories and sources for your expenses and incomes.
            Then, as you spend (and earn), update the app easily. Everything
            else is taken care of.
          </p>
        </div>
      </v-img>
    </v-layout>
    <v-bottom-sheet v-model="drawer" hide-overlay full-width>
      <v-list class="pa-5">
        <v-list-tile>
          <p class="headline" v-if="login">Login to Budgie</p>
          <p class="headline pb-3" v-if="signup">Sign up to Budgie</p>
        </v-list-tile>
        <Login v-if="login" />
        <CreateAccount v-if="signup" />
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Login from './Login'
import CreateAccount from './CreateAccount'
import loading from 'vue-full-loading'
const fb = require('../../firebaseConfig')

export default {
  computed: {
    ...mapState(['performingRequest'])
  },
  components: {
    Login,
    CreateAccount,
    loading
  },
  data() {
    return {
      view: 'Login',
      budgie: require('../../assets/images/budgie.png'),
      piggy: require('../../assets/images/piggie-bank.jpg'),
      budgie_full: require('../../assets/images/budgie_full.jpg'),
      signup: false,
      login: false,
      drawer: null
    }
  },
  methods: {
    switchView(name) {
      this.view = name
    },
    signUp() {
      this.login = false
      this.signup = true
      this.drawer = !this.drawer
    },
    loginForm() {
      this.signup = false
      this.login = true
      this.drawer = !this.drawer
    }
  }
}
</script>

<style>
.m-auto {
  margin: 0 auto;
}

.rel_text {
  position: relative;
  top: 370px;
  left: 100px;
}
</style>
