<template>
  <v-layout fluid grid-list-md class="ml-3">
    <v-layout row wrap>
      <v-flex d-flex class="mw-200">
        <a @click="showUpload">
          <v-img
            :src="userPhoto"
            v-if="userPhoto"
            aspect-ratio="1"
            height="200"
            contain
            position="left"
            alt="profile picture"
            class="elevation-5"
            max-width="200"
          >
            <v-layout
              pa-2
              column
              fill-height
              class="white--text bottom-gradient"
            >
              <v-spacer></v-spacer>
              <v-flex shrink>
                <div class="subheading">Update profile picture</div>
              </v-flex>
            </v-layout>
          </v-img>
          <v-img
            src="https://api.adorable.io/avatars/285/abott@adorable.png"
            v-else
            aspect-ratio="1"
            height="200"
            contain
            position="left"
            alt="profile picture"
            class="elevation-5"
            max-width="200"
          >
            <v-layout
              pa-2
              column
              fill-height
              class="white--text bottom-gradient"
            >
              <v-spacer></v-spacer>
              <v-flex shrink>
                <div class="subheading">Update profile picture</div>
              </v-flex>
            </v-layout>
          </v-img>
        </a>
      </v-flex>
      <v-flex d-flex xs12 sm6 md3 class="ml-3">
        <v-card>
          <v-card-title>
            <span class="headline">Update user name</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="displayName"
              :type="text"
              label="Update user name"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              round
              :loading="loading"
              color="blue darken-2"
              class="white--text"
              @click="updateDisplayName"
              >Submit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md3 class="ml-3">
        <v-layout row wrap>
          <v-flex d-flex>
            <v-card>
              <v-card-text>
                <v-text-field
                  v-model="newPassword"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="New password"
                  hint="At least 8 characters"
                  counter
                  validate-on-blur
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  :append-icon="show2 ? 'visibility' : 'visibility_off'"
                  :rules="[rules.match]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-2"
                  label="Confirm password"
                  counter
                  validate-on-blur
                  @click:append="show2 = !show2"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  round
                  :loading="loading"
                  color="blue darken-2"
                  :disabled="!matched"
                  class="white--text"
                  @click="updatePassword"
                  >Submit</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <upload
        url
        lang-type="en"
        v-model="show"
        :noCircle="true"
        :withCredentials="true"
        @crop-success="cropSuccess"
      ></upload>
    </v-layout>
  </v-layout>
</template>

<script>
import Upload from 'vue-image-crop-upload'
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig.js')
export default {
  created() {
    if (this.currentUser.photoURL) {
      this.userPhoto = this.currentUser.photoURL
    }
  },
  components: {
    Upload
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      displayName: '',
      show: false,
      userPhoto: '',
      show1: false,
      show2: false,
      loading: false,
      rules: {
        required: value => !!value || 'Required',
        min: v => v.length >= 8 || 'Min 8 characters are required',
        match: value => value == this.newPassword || 'Passwords do not match'
      }
    }
  },
  computed: {
    matched() {
      let one = this.newPassword
      let two = this.confirmPassword

      if (one == two) {
        return true
      }

      return false
    },
    ...mapState(['currentUser'])
  },
  methods: {
    updateDisplayName() {
      let user = fb.auth.currentUser
      let displayName = this.displayName

      this.loading = true

      user
        .updateProfile({
          displayName: displayName
        })
        .then(() => {
          this.$toasted.global.success({
            message: 'Your name has been updated successfully'
          })
        })
        .then(() => {
          this.displayName = ''
          this.loading = false
        })
    },
    updatePassword() {
      let user = fb.auth.currentUser
      let newPassword = this.newPassword

      this.loading = true

      user
        .updatePassword(newPassword)
        .then(() => {
          this.$toasted.global.success({
            message: 'Your password has been updated successfully!'
          })
        })
        .then(() => {
          this.loading = false
        })
    },
    showUpload() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl) {
      let uid = this.$store.state.currentUser.uid
      let file = imgDataUrl
      let user = fb.auth.currentUser
      fb.storage
        .ref(uid)
        .child('avatar')
        .putString(file, 'data_url')
        .then(() => {
          this.$toasted.global.success({
            message: 'Avatar uploaded'
          })
        })
        .then(() => {
          fb.storage
            .ref(uid)
            .child('avatar')
            .getDownloadURL()
            .then(url => {
              user.updateProfile({
                photoURL: url
              })
              this.$store.dispatch('fetchUser')
            })
        })
    }
  }
}
</script>

<style>
.bottom-gradient {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
  max-width: 200px;
}
</style>
