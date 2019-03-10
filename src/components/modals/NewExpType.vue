<template>
  <div class="modal is-active" v-if="showNewNameModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new expense name</p>
        <button @click="closeModal" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="control has-icons-left v-spacing">
          <float-label>
            <input type="text" class="input" v-model="newName" placeholder="Add name">
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
  import { mapState } from "vuex";
  const fb = require("../../firebaseConfig");
  export default {
    computed: {
      ...mapState(["showNewNameModal"])
    },
    data() {
      return {
        newName: ""
      };
    },
    methods: {
      addCategory() {
        let category = this.newName;
        let currentUser = this.$store.state.currentUser.uid;
        let currCategories = { categories: [] };

        let docRef = fb.db.collection("ExpenseCategories").doc(currentUser);

        docRef
          .get()
          .then(doc => {
            let categories = doc.data().categories;

            categories.forEach(d => {
              currCategories.categories.push(d);
            });
          })
          .then(() => {
            currCategories.categories.push(category);
          })
          .then(() => {
            docRef.set(currCategories);
          })
          .then(() => {
            this.newName = "";
            this.$store.dispatch('fetchBaseCategories');
          }).then(() => {
            this.$toasted.show('New expense name added successfully', {
              theme: 'bubble',
              position: 'top-center',
              duration: 5000,
              type: 'success',
              fitToScreen: true
            })
          })
      },
      closeModal() {
        this.$store.state.showNewNameModal = false;
      }
    }
  };
</script>

