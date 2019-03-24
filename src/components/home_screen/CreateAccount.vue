<template>
  <div class="column">
    <div class="columns">
      <div class="column is-two-thirds">
        <form @submit.prevent>
          <h1 class="title login-title">Create your Budgie account</h1>
          <div class="field">
            <label for="email1" class="label">Email</label>
            <div class="control has-icons-left">
              <input
                class="input"
                v-model.trim="signupForm.email"
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
                v-model.trim="signupForm.password"
                type="password"
                placeholder="******"
                id="password1"
              />
            </div>
          </div>
          <div>
            <div class="buttons">
              <button
                @click="signup"
                class="button is-rounded is-medium login-button"
              >
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const fb = require('../../firebaseConfig')
export default {
  data() {
    return {
      signupForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signup() {
      this.performingRequest = true

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(() => {
          this.$store.dispatch('fetchUserProfile')
          this.performingRequest = false
          this.$router.push('/home')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
