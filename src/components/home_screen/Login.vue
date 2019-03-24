<template>
  <div class="column">
    <div class="columns">
      <div class="column is-two-thirds">
        <form v-if="showLoginForm" @submit.prevent>
          <h1 class="title login-title">Sign in to view budget</h1>
          <div class="field">
            <label for="email1" class="label">Email</label>
            <div class="control has-icons-left">
              <input
                class="input"
                v-model.trim="loginForm.email"
                type="text"
                placeholder="you@email.com"
                id="email1"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label for="password1" class="label">Password</label>
            <div class="control">
              <input
                class="input"
                v-model.trim="loginForm.password"
                type="password"
                placeholder="******"
                id="password1"
              />
            </div>
          </div>
          <div>
            <div class="buttons">
              <button
                @click="login"
                class="button is-rounded is-medium login-button"
              >
                Log In
              </button>
              <button @click="toggleForgotPasswordReset" class="button is-text">
                Forgot Password
              </button>
            </div>
          </div>
        </form>
        <form v-if="showForgotPassword" @submit.prevent class="password-reset">
          <div v-if="!passwordResetSuccess">
            <h1 class="title login-title">Reset Password</h1>
            <p>We will send you an email to reset your password</p>

            <div class="field">
              <label for="email3" class="label">Email</label>
              <div class="control has-icons-left">
                <input
                  v-model.trim="passwordForm.email"
                  type="text"
                  placeholder="you@email.com"
                  id="email3"
                  class="input"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div>
              <div class="buttons">
                <button
                  @click="resetPassword"
                  class="button is-rounded is-medium login-button"
                >
                  Submit
                </button>
                <button
                  @click="toggleForgotPasswordReset"
                  class="button is-text"
                >
                  Back To Log In
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button @click="toggleForgotPasswordReset" class="button">
              Back to login
            </button>
          </div>
        </form>
        <transition name="fade">
          <div v-if="errorMsg !== ''" class="error-msg">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
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
      errorMsg: ''
    }
  },
  methods: {
    login() {
      this.performingRequest = true

      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user)
          this.performingRequest = false
          this.$router.push('/home')
        })
        .catch(err => {
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    resetPassword() {
      this.performingRequest = true

      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false
          this.passwordResetSuccess = true
          this.passwordForm.email = ''
        })
        .catch(err => {
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    toggleForgotPasswordReset() {
      this.showLoginForm = !this.showLoginForm
      this.showForgotPassword = !this.showForgotPassword
    }
  }
}
</script>