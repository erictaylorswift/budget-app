<template>
  <v-layout wrap row align-end fill-height class="ml-3 w-100">
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="green darken-2">account_balance_wallet</v-icon>
        <span class="title green--text text--darken-2">Budgeted income</span>
      </v-card-title>
      <v-card-text>
        <ICountUp
          :endVal="Budgets.budgetIncome"
          :options="options"
          class="display-1 font-weight-bold grey--text text--darken-2"
        />
      </v-card-text>
    </v-card>
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="orange darken-2">money</v-icon>
        <span class="title orange--text text--darken-2">Budgeted expenses</span>
      </v-card-title>
      <v-card-text>
        <ICountUp
          :endVal="Budgets.budgetExpenses"
          :options="options"
          class="display-1 font-weight-bold grey--text text--darken-2"
        />
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
      <v-card-text>
        <ICountUp
          :endVal="netBudget.budgetNet"
          :options="options"
          class="display-1 font-weight-bold grey--text text--darken-2"
        />
      </v-card-text>
    </v-card>
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="orange darken-2">money</v-icon>
        <span class="title orange--text text--darken-2"
          >Percent of budget remaining</span
        >
      </v-card-title>
      <v-card-text>
        <ICountUp
          :endVal="netBudget.percent"
          :options="percentOptions"
          class="display-1 font-weight-bold grey--text text--darken-2"
        />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import numeral from 'numeral'
import moment from 'moment'
import ICountUp from 'vue-countup-v2'
export default {
  components: {
    ICountUp
  },
  data() {
    return {
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '$',
        suffix: '',
        duration: 1
      },
      percentOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: '%'
      }
    }
  },
  created() {
    this.$store.dispatch('fetchBudgetTotals')
    this.$store.dispatch('fetchExpenseTotals')
    this.$store.dispatch('fetchExpenses')
  },
  computed: {
    ...mapState(['Budgets', 'Expenses']),
    ...mapGetters(['incomeTotals']),
    netBudget() {
      let state = this.$store.state
      let budgetNet = state.Budgets.budgetDiff
      let expenseTotal = state.Expenses.expTotal
      let currentNet = state.incTotal - expenseTotal
      let diff = currentNet - budgetNet
      let budgetedExp = state.Budgets.budgetExpenses
      let remainingExp = expenseTotal - budgetedExp
      let percentRem = (remainingExp / budgetedExp) * 100

      return {
        budgetNet: budgetNet,
        currentNet: currentNet,
        diff: diff,
        percent: Number(Number(percentRem).toFixed(0)),
        incTotal: state.incTotal
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
