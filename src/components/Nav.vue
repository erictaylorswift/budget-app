<template>
  <div>
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="goHome">
        <img src="..\assets\images\home.png" />
      </md-button>
      <div class="md-toolbar-section-end">
        <md-button @click="newIncome">Add income</md-button>
        <md-button @click="newExpense">Add Expense</md-button>
        <md-button @click="logout">
          <md-icon>exit_to_app</md-icon>
        </md-button>
      </div>
    </md-toolbar>
  </div>
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
