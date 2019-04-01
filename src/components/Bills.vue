<template>
  <div class="nes-table-responsive">
    <h3>Bills</h3>
    <table class="nes-table is-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Expense</th>
          <th>Category</th>
          <th>Expensee</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in expenses" :key="expense.id">
          <td v-if="getDateDiff(expense.date)">
            {{ expense.date | formatDate }}
          </td>
          <td v-if="getDateDiff(expense.date)">{{ expense.type }}</td>
          <td v-if="getDateDiff(expense.date)">{{ expense.category }}</td>
          <td v-if="getDateDiff(expense.date)">{{ expense.note }}</td>
          <td v-if="getDateDiff(expense.date)">
            {{ expense.amount | formatCurrency }}
          </td>
        </tr>
        <tr>
          <td style="border-right: none;"></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="background-color: black; color: white;">
            {{ this.total | formatCurrency }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'

export default {
  created() {
    this.$store.dispatch('fetchBudget')
    this.$store.dispatch('fetchExpenses')
    this.$store.dispatch('fetchExpenseTotals')
  },
  computed: {
    ...mapState(['budgets', 'expenses', 'expTotal'])
  },
  methods: {
    getDateDiff(date) {
      let start = moment(this.$store.state.budgets[0].start)
      let end = moment(this.$store.state.budgets[0].end)
      let expDate = moment(date)

      let startDiff = expDate.diff(start, 'days')
      let endDiff = expDate.diff(end, 'days')

      if (startDiff > -1 && endDiff < 1) {
        return true
      }
    }
  },
  data() {
    return {}
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
