<template>
  <v-toolbar color="purple" fixed>
    <v-menu :nudge-width="100">
      <template v-slot:activator="{ on }">
        <v-toolbar-title v-on="on">
          <span>Budgie</span>
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
      </template>

      <v-list>
        <v-tile @click="newIncome">
          <v-tile-title>Add income</v-tile-title>
        </v-tile>
        <v-tile @click="newExpense">
          <v-tile-title>Add expense</v-tile-title>
        </v-tile>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat @click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')
export default {
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    viewExpenses() {
      this.$router.push('expenses')
    },
    currentBudget() {
      this.$router.push('current-budget')
    },
    expenseChart() {
      this.$router.push('/charts')
    },
    goHome() {
      this.$router.push('/home')
    },
    goToSettings() {
      this.$router.push('/settings')
    },
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.commit('setCurrentUser', null)
          this.$router.push('login')
        })
        .catch(err => {
          alert(err)
        })
    },
    newExpense() {
      this.$store.state.showExpenseModal = true
    },
    newIncome() {
      this.$store.state.showIncomeModal = true
    }
  }
}
</script>
