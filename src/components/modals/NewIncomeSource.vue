<template>
  <div class="modal is-active" v-if="showNewIncSourceModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new expense name</p>
        <button @click="closeModal" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="control has-icons-left v-spacing">
          <float-label>
            <input type="text" class="input" v-model="newSource" placeholder="Add name">
          </float-label>
          <span class="icon is-medium is-left">
            <i class="fas fa-pen-fancy"></i>
          </span>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="addSource" class="button is-rounded is-success">Add</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const fb = require("../../firebaseConfig");

  export default {
      created() {
          this.$store.dispatch('fetchIncomeSources')
      },
      computed: {
          ...mapState(['showNewIncSourceModal'])
      },
      data() {
          return {
              newSource: ''
          }
      }, 
      methods: {
          closeModal() {
              this.$store.state.showNewIncSourceModal = false;
          },
          addSource() {
              let cat = this.newSource;
              let uid = this.$store.state.currentUser.uid;
              let source = { source: [] };

              let docRef = fb.db.collection('IncomeSources').doc(uid);

              docRef
              .get()
              .then(doc => {
                  let sources = doc.data().source;

                  sources.forEach(t => {
                      source.source.push(t)
                  });
              })
              .then(() => {
                  source.source.push(cat)
              })
              .then(() => {
                  docRef.set(source)
              })
              .then(() => {
                  this.$toasted.global.success({
                      message: "You've successfully added " + this.newSource
                  })
                  this.$store.dispatch('fetchIncomeSources')
              })
              .then(() => {
                  this.newSource = ''
              })
          }
      }
  };
</script>

