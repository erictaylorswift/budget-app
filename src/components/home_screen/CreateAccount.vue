<template>
  <div>
    <v-form ref="signupForm" v-model="valid" lazy-validation>
      <v-layout wrap>
        <v-flex xs6>
          <v-layout column justify-end>
            <v-text-field
              v-model="signupForm.email"
              label="Email"
              type="email"
              prepend-icon="alternate_email"
              class="mr-5"
            ></v-text-field>
            <v-text-field
              v-model="signupForm.password"
              label="Password"
              type="password"
              prepend-icon="lock"
              class="mr-5"
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              @click:append="visible = !visible"
              @keyup.13="signup"
            ></v-text-field>
            <v-layout wrap column align-end class="m4-4">
              <v-btn dark color="green" @click="signup">
                Sign up
                <v-icon right small dark>thumb_up</v-icon>
              </v-btn>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-form>
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
      },
      visible: false
    }
  },
  methods: {
    signup() {
      this.$store.state.performingRequest = true

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(() => {
          this.$store.dispatch('fetchUser')
          this.$store.state.performingRequest = false
        })
        .catch(err => {
          console.log(err)
        })
      this.$router.push('/getting-started')
    }
  }
}
</script>
