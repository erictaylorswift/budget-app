<template>
  <badger-accordion :icons="this.accordion.icons">
    <badger-accordion-item>
      <div slot="header">Add expense name</div>
      <template slot="content">
        <div class="columns">
          <div class="control column">
            <input class="input" v-model="newCategory">
          </div>
          <div class="buttons column is-right">
            <button class="button is-rounded" @click="addCategory">Add category</button>
          </div>
        </div>
      </template>
    </badger-accordion-item>
  </badger-accordion>
</template>

<script>
  const fb = require("../firebaseConfig");

  export default {
    created() {
      this.$store.dispatch("fetchBaseCategories");
    },
    data() {
      return {
        newCategory: "",
        accordion: {
          icons: {
            closed: '<i class="fas fa-arrow-down"></i>',
            opened: '<i class="fas fa-arrow-up"></i>'
          },
          options: {
            panelClass: "accordion-header"
          }
        }
      };
    },
    methods: {
      addCategory() {
        let category = this.newCategory;
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
            this.newCategory = "";
          });
      }
    }
  };
</script>
