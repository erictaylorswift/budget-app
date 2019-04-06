<template>
  <div v-if="showNewNameModal">
    <v-card class="pa-5">
      <v-card-title>
        <span class="headline">Add new expense source</span>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm6 md6>
            <v-text-field
              v-model="newName"
              label="Add source name"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab medium color="success" @click="addCategory">
          <v-icon @click="addCategory">check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const fb = require('../../firebaseConfig')
export default {
  computed: {
    ...mapState(['showNewNameModal'])
  },
  data() {
    return {
      newName: ''
    }
  },
  methods: {
    addCategory() {
      let category = this.newName
      let currentUser = this.$store.state.currentUser.uid
      let currCategories = { categories: [] }

      let docRef = fb.db.collection('ExpenseCategories').doc(currentUser)

      docRef
        .get()
        .then(doc => {
          let categories = doc.data().categories

          categories.forEach(d => {
            currCategories.categories.push(d)
          })
        })
        .then(() => {
          currCategories.categories.push(category)
        })
        .then(() => {
          docRef.set(currCategories)
        })
        .then(() => {
          this.$toasted.global.success({
            message: "You've successfully added " + this.newName
          })
          this.$store.dispatch('fetchBaseCategories')
        })
        .then(() => {
          this.newName = ''
        })
    },
    closeModal() {
      this.$store.state.showNewNameModal = false
    }
  }
}
</script>
