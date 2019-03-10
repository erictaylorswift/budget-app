<template>
  <div class="columns">
    <div class="column is-half">
      <p class="title">Edit your account</p>
      <article class="media">
        <figure class="media-left">
          <p class="image is-128x128">
            <a @click="showUpload">
              <img :src="userPhoto" v-if="userPhoto">
              <img v-else src="https://api.adorable.io/avatars/285/abott@adorable.png">
            </a>
            <upload
              url=""
              lang-type="en"
              v-model="show"
              :noCircle = true
              :withCredentials = true
              @crop-success="cropSuccess"
            ></upload>
          </p>
        </figure>
        <div class="media-content">
          <div class="content v-spacing">
            <div class="field">
              <div class="control">
                <float-label>
                  <input
                    v-model="newPassword"
                    type="password"
                    class="input"
                    placeholder="new password"
                  >
                </float-label>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <float-label>
                  <input
                    v-model="confirmPassword"
                    type="password"
                    class="input"
                    placeholder="confirm password"
                    :class="{ 'is-danger': !matched}"
                  >
                </float-label>
              </div>
              <p v-if="!matched" class="help is-danger">Passwords don't match</p>
            </div>
          </div>
          <div class="buttons is-right">
            <button
              @click="updatePassword"
              class="button is-primary is-rounded"
              :disabled="!matched"
            >Save password</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  import Upload from "vue-image-crop-upload";
  import { mapState } from 'vuex';
  const fb = require("../../firebaseConfig.js");
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
        newPassword: "",
        confirmPassword: "",
        show: false,
        userPhoto: ''
      };
    },
    computed: {
      matched() {
        let one = this.newPassword;
        let two = this.confirmPassword;

        if (one == two) {
          return true;
        }

        return false;
      },
      ...mapState(['currentUser'])
    },
    methods: {
      updatePassword() {
        let user = fb.auth.currentUser;
        let newPassword = this.newPassword;

        user.updatePassword(newPassword).then(() => {
          this.$toasted.global.success({
            message: "Your password has been updated successfully!"
          });
        });
      },
      showUpload() {
        this.show = !this.show;
      },
      cropSuccess(imgDataUrl) {
          let uid = this.$store.state.currentUser.uid;
          let file = imgDataUrl;
          let user = fb.auth.currentUser;
        fb.storage.ref(uid).child('avatar')
        .putString(file, 'data_url').then(() => {
            this.$toasted.global.success({
                message: 'Avatar uploaded'
            })
        }).then(() => {
          fb.storage.ref(uid).child('avatar').getDownloadURL().then((url) => {
            user.updateProfile({
              photoURL: url
            })
            this.$store.dispatch('fetchUser')
          })
        })
        
    },
    },
    
    
  };
</script>
