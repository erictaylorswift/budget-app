<template>
  <div class="modal is-active" v-if="showNewCatModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new expense name</p>
        <button @click="closeModal" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="control has-icons-left v-spacing">
          <float-label>
            <input type="text" class="input" v-model="newCat" placeholder="Add name">
          </float-label>
          <span class="icon is-medium is-left">
            <i class="fas fa-pen-fancy"></i>
          </span>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="addCategory" class="button is-rounded is-success">Add</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const fb = require("../../firebaseConfig");

  export default {
      created() {
          this.$store.dispatch('fetchBaseTypes')
      },
      computed: {
          ...mapState(['showNewCatModal'])
      },
      data() {
          return {
              newCat: ''
          }
      }, 
      methods: {
          closeModal() {
              this.$store.state.showNewCatModal = false;
          },
          addCategory() {
              let cat = this.newCat;
              let uid = this.$store.state.currentUser.uid;
              let categories = { types: [] };

              let docRef = fb.db.collection('ExpenseTypes').doc(uid);

              docRef
              .get()
              .then(doc => {
                  let types = doc.data().types;

                  types.forEach(t => {
                      categories.types.push(t)
                  });
              })
              .then(() => {
                  categories.types.push(cat)
              })
              .then(() => {
                  docRef.set(categories)
              })
              .then(() => {
                  this.$toasted.global.success({
                      message: "You've successfully added " + this.newCat
                  })
                  this.$store.dispatch('fetchBaseTypes')
              })
              .then(() => {
                  this.newCat = ''
              })
          }
      }
  };
</script>

