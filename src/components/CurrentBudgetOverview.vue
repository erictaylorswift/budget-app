<template>
  <v-layout wrap row align-end fill-height class="ml-3 w-100 mb-4">
    <v-card class="elevation-5 mw-300 mr-3 mt-3">
      <v-card-title>
        <v-icon left color="green darken-2">account_balance_wallet</v-icon>
        <span class="title green--text text--darken-2">Income</span>
      </v-card-title>
      <v-card-text class="headline font-weight-bold">{{
        Budgets.budgetTotals[0].income | formatCurrency
      }}</v-card-text>
    </v-card>
  </v-layout>
  <!-- <v-item-group multiple>
    <v-item>
      <div>
        <p class="heading">Income</p>
        <p class="title">
          {{ Budgets.budgetTotals[0].income | formatCurrency }}
        </p>
      </div>
    </v-item>
    <v-item>
      <div>
        <p class="heading">Expenses</p>
        <p class="title">
          {{ Budgets.budgetTotals[0].expenses | formatCurrency }}
        </p>
      </div>
    </v-item>
    <div>
      <div>
        <p class="heading">Surplus</p>
        <p class="title">
          {{ Budgets.budgetTotals[0].difference | formatCurrency }}
        </p>
      </div>
    </div>
  </v-item-group>-->
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'
export default {
  computed: {
    ...mapState(['Budgets'])
  },
  filters: {
    formatCurrency(val) {
      let value = numeral(val).format('$0,0')
      return value
    }
  }
}
</script>
