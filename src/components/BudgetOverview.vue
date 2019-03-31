<template>
  <v-layout wrap row align-end fill-height class="ml-3 w-100">
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="green darken-2">account_balance_wallet</v-icon>
        <span class="title green--text text--darken-2">Budgeted income</span>
      </v-card-title>
      <v-card-text class="headline font-weight-bold">
        {{ Budgets.budgetTotals[0].income | formatCurrency }}
      </v-card-text>
    </v-card>
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="orange darken-2">money</v-icon>
        <span class="title orange--text text--darken-2">Budgeted expenses</span>
      </v-card-title>
      <v-card-text class="headline font-weight-bold">
        {{ Budgets.budgetTotals[0].expenses | formatCurrency }}
      </v-card-text>
    </v-card>
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title v-if="netBudget.budgetNet > 0">
        <v-icon left color="green lighten-2">thumb_up</v-icon>
        <span class="title green--text text--lighten-2">Budget surplus</span>
      </v-card-title>
      <v-card-title v-else>
        <v-icon left color="red lighten-2">thumb_down</v-icon>
        <span class="title red--text text--lighten-2">Budget deficit</span>
      </v-card-title>
      <v-card-text class="headline font-weight-bold">
        {{ netBudget.budgetNet | formatCurrency }}
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'
import moment from 'moment'
export default {
  created() {
    this.$store.dispatch('fetchBudgetTotals')
    this.$store.dispatch('fetchExpenseTotals')
    this.$store.dispatch('fetchExpenses')
  },
  computed: {
    ...mapState(['Budgets', 'Expenses']),
    netBudget() {
      let state = this.$store.state
      let budgetNet = state.Budgets.budgetTotals[0].difference
      let currentNet = state.incTotal - state.Expenses.expTotal
      let diff = currentNet - budgetNet

      if (diff > 0) {
        // eslint-disable-next-line
          this.positiveNet = true
      }

      return {
        budgetNet: budgetNet,
        currentNet: currentNet,
        diff: diff
      }
    }
  },
  filters: {
    formatDate(val) {
      let date = moment(val).format('MMM Do, YYYY')
      return date
    },
    formatCurrency(val) {
      let value = numeral(val).format('$0,0')
      return value
    }
  }
}
</script>
