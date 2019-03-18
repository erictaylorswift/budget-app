<template>
  <nav
    class="navbar is-fixed-top is-black"
    role="navigation"
    v-if="currentUser"
  >
    <div class="container">
      <div class="navbar-brand">
        <a @click="goHome" class="navbar-item">
          <img src="..\assets\images\home.png" />
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <a @click="viewExpenses" class="navbar-item has-text-weight-semibold"
            >Expenses</a
          >
          <a @click="currentBudget" class="navbar-item has-text-weight-semibold"
            >Budgets</a
          >
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a @click="newIncome" class="button is-rounded is-link">
                <span class="icon has-text-white">
                  <i class="fas fa-hand-holding-usd"></i>
                </span>
                <span class="has-text-white">Add Income</span>
              </a>
              <a @click="newExpense" class="button is-rounded is-success">
                <span class="icon has-text-white">
                  <i class="fas fa-file-invoice-dollar"></i>
                </span>
                <span class="has-text-white">Add Expense</span>
              </a>
              <a @click="logout" class="button is-rounded">
                <span class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </a>
              <a class="link" @click="goToSettings">
                <i class="fas fa-cog"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
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
