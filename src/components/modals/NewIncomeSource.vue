<template>
  <div v-if="showNewIncSourceModal">
    <v-card class="pa-5">
      <v-card-title>
        <span class="headline">Add new income source</span>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm6 md6>
            <v-text-field
              v-model="newSource"
              label="Add source name"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab medium color="success" @click="addSource">
          <v-icon @click="addSource">check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig')

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
      this.$store.state.showNewIncSourceModal = false
    },
    addSource() {
      let cat = this.newSource
      let uid = this.$store.state.currentUser.uid
      let source = { source: [] }

      let docRef = fb.db.collection('IncomeSources').doc(uid)

      docRef
        .get()
        .then(doc => {
          let sources = doc.data().source

          sources.forEach(t => {
            source.source.push(t)
          })
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
}
</script>
