/* eslint-disable vue/no-async-in-computed-properties */
<template>
  <div v-if="showNewCatModal">
    <v-card class="pa-5">
      <v-card-title>
        <span class="headline">Add new expense category</span>
      </v-card-title>
      <v-card-text>
        <v-layout wrap align-center>
          <v-flex>
            <v-combobox
              v-model="newCat"
              :items="categories"
              :search-input.sync="search"
              hide-selected
              label="Select a category or create a new one"
              small-chips
            >
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      No results matching "
                      <strong>{{ search }}</strong
                      >". Press <kbd>enter</kbd> to create a new one.
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-combobox>
            <!-- <v-text-field
              v-model="newCat"
              label="Add expense category"
              type="text"
              class="mr-4"
            ></v-text-field>-->
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="newName"
              label="Add expense source"
              append-icon="done"
              @click:append="addName"
              @keyup.13="addName"
              type="text"
              class="mr-4"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <div class="text-center">
              <v-chip
                v-for="item in catNames"
                :key="item"
                close
                @input="remove(item)"
                >{{ item }}</v-chip
              >
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab medium color="success" @click="addCategory">
          <v-icon>check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
const fb = require('../../firebaseConfig')

export default {
  created() {
    this.$store.dispatch('fetchBaseTypes')
  },
  computed: {
    ...mapState(['showNewCatModal', 'Budgets']),
    ...mapGetters(['categories'])
  },
  data() {
    return {
      newCat: '',
      newName: '',
      catNames: [],
      obj: [],
      search: null
    }
  },
  methods: {
    closeModal() {
      this.$store.state.showNewCatModal = false
    },
    addName() {
      if (this.newName != '') {
        this.catNames.push(this.newName)
        this.newName = ''
      } else {
        this.$toasted.global.error({
          message: 'Please include a source name'
        })
      }
    },
    remove(item) {
      this.catNames.splice(this.catNames.indexOf(item), 1)
      this.catNames = [...this.catNames]
    },
    addCategory() {
      let catType = this.newCat
      let names = this.catNames
      let uid = this.$store.state.currentUser.uid

      let docRef = fb.db.collection('ExpenseTypes').doc(uid)

      let obj = []

      docRef
        .get()
        .then(doc => {
          let data = doc.data()
          let keys = Object.keys(data)

          keys.forEach(k => {
            if (k == catType) {
              data[k].forEach(a => {
                obj.push(a)
              })
            }
          })
        })
        .then(() => {
          names.forEach(n => {
            obj.push(n)
          })
        })
        .then(() => {
          fb.db
            .collection('ExpenseTypes')
            .doc(uid)
            .update({
              [catType]: obj
            })
        })
        .then(() => {
          this.newCat = ''
          this.newName = ''
          this.obj = []
          this.catNames = []
          this.$store.dispatch('fetchBaseTypes')
        })
    }
  }
}
</script>
