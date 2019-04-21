<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation v-if="showLoginForm">
      <v-layout wrap>
        <v-flex xs6>
          <v-layout column justify-end>
            <v-text-field
              v-model="loginForm.email"
              :rules="emailRules"
              label="Email"
              type="email"
              required
              prepend-icon="alternate_email"
              class="mr-5"
            ></v-text-field>
            <v-text-field
              v-model="loginForm.password"
              prepend-icon="lock"
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              :type="visible ? 'text' : 'password'"
              :rules="passwordRules"
              label="Password"
              @click:append="visible = !visible"
              class="mr-5"
              @keyup.13="login"
            ></v-text-field>
            <v-layout wrap column align-end class="mr-4">
              <v-btn dark color="green" @click="login">
                Login
                <v-icon right small dark>thumb_up</v-icon>
              </v-btn>
              <v-btn
                small
                :flat="true"
                color="blue"
                @click="toggleForgotPasswordReset"
                >Forgot password</v-btn
              >
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-form>
    <v-form v-if="showForgotPassword">
      <v-layout wrap fill-height>
        <v-flex xs6>
          <v-layout column>
            <v-flex>
              <v-text-field
                v-model="passwordForm.email"
                :rules="emailRules"
                label="Email"
                type="email"
                prepend-icon="alternate_email"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-flex>
                <v-btn
                  small
                  :flat="true"
                  color="blue"
                  @click="toggleForgotPasswordReset"
                  >Return to login</v-btn
                >
              </v-flex>
              <v-flex justify-end align-center>
                <p class="body-1 pa-0 ma-0">
                  We will send you an email with your reset password
                </p>
                <v-btn dark color="green" @click="resetPassword">
                  Reset
                  <v-icon small right>thumb_up</v-icon>
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout wrap v-if="errorMsg !== ''">
      <v-flex>
        <span class="red--text text--lighten-1">{{ errorMsg }}</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
const fb = require('../../firebaseConfig')
export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      passwordForm: {
        email: ''
      },
      myCroppa: {},
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [v => !!v || 'Password is required'],
      visible: false,
      valild: true
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store.state.performingRequest = true
        fb.auth
          .signInWithEmailAndPassword(
            this.loginForm.email,
            this.loginForm.password
          )
          .then(user => {
            this.$store.commit('setCurrentUser', user.user)
            this.$store.state.performingRequest = false
            this.$router.push('/home')
          })
          .catch(err => {
            this.$store.state.performingRequest = false
            this.$toasted.global.error({
              message: err.message
            })
          })
      }
    },
    resetPassword() {
      this.$store.state.performingRequest = true

      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.$store.state.performingRequest = false
          this.passwordResetSuccess = true
          this.passwordForm.email = ''
        })
        .catch(err => {
          this.$store.state.performingRequest = false
          this.$toasted.global.error({
            message: err.message
          })
        })
    },
    toggleForgotPasswordReset() {
      this.showLoginForm = !this.showLoginForm
      this.showForgotPassword = !this.showForgotPassword
    },
    toggleErrMsg(val) {
      this.errorMsg = val
      setTimeout(() => (this.errorMsg = ''), 2000)
    }
  }
}
</script>
