<template>
  <div>
    <h3 class="title ma-2">Expenses</h3>
    <v-layout row wrap align-center>
      <v-speed-dial
        direction="left"
        transition="slide-y-reverse-transition"
        v-model="fab"
        absolute
        class="v-speed__dial"
      >
        <template slot="activator">
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon class="v-btn-activator">add</v-icon>
            <v-icon class="v-btn-activator">close</v-icon>
          </v-btn>
        </template>
        <v-btn @click="openIncSourceModal" round dark color="amber darken-4">
          Add income source
          <v-icon small>trending_up</v-icon>
        </v-btn>
        <v-btn @click="openNewCatModal" round dark color="deep-purple darken-1">
          Add / edit expense category
          <v-icon small>category</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-layout>
    <v-flex>
      <v-card
        v-for="(source, index) in Budgets.baseTypes"
        :key="index"
        class="ma-2"
        color="deep-purple darken-1"
      >
        <v-card-title class="subheading font-weight-bold white--text">
          {{ index }}
        </v-card-title>
        <v-divider></v-divider>
        <div class="pa-3">
          <v-chip
            v-for="name in source"
            :key="name"
            color="deep-purple lighten-4 elevation-3"
            >{{ name }}</v-chip
          >
        </div>
      </v-card>
    </v-flex>
    <v-divider class="ma-2"></v-divider>
    <h3 class="title ma-2">Income</h3>
    <v-flex>
      <v-card class="ma-2" color="amber darken-4" dark>
        <v-card-title class="subheading font-weight-bold"
          >Income sources</v-card-title
        >
        <v-divider></v-divider>
        <div class="pa-3">
          <v-chip
            v-for="category in Budgets.incomeSources"
            :key="category.id"
            color="amber lighten-4"
            light
            >{{ category }}</v-chip
          >
        </div>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  created() {
    this.$store.dispatch('fetchBaseCategories')
    this.$store.dispatch('fetchBaseTypes')
    this.$store.dispatch('fetchIncomeSources')
  },
  computed: {
    ...mapState(['Expenses', 'Budgets']),
    sortedNames() {
      let names = this.$store.state.Budgets.expensees
      names.sort()

      return names
    }
  },
  data() {
    return {
      showLess: true,
      categorization: true,
      account: false,
      expandSingle: false,
      expandNames: false,
      fab: false
    }
  },
  methods: {
    openIncSourceModal() {
      this.$store.state.bottomSheet = true
      this.$store.state.showNewIncSourceModal = true
    },
    openNewCatModal() {
      this.$store.state.bottomSheet = true
      this.$store.state.showNewCatModal = true
    },
    switchAccount() {
      this.categorization = false
      this.account = true
    },
    switchCategorization() {
      this.categorization = true
      this.account = false
    }
  }
}
</script>

<style>
.v-btn-activator {
  top: -9px !important;
}

.v-speed__dial {
  right: 110px;
  top: 44px;
}
</style>
