<template>
  <div class="box">
    <div class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Income</p>
          <p class="title">
            {{ Budgets.budgetTotals[0].income | formatCurrency }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Expenses</p>
          <p class="title">
            {{ Budgets.budgetTotals[0].expenses | formatCurrency }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Surplus</p>
          <p class="title">
            {{ Budgets.budgetTotals[0].difference | formatCurrency }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
