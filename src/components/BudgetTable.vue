<template>
  <div class="box">
    <div class="columns">
      <v-table
        :data="leftInBudget"
        class="table is-bordered column is-hoverable budget-table is-fullwidth"
      >
        <thead slot="head">
          <v-th sortKey="name">Expense</v-th>
          <v-th sortKey="amount">Budgeted</v-th>
          <v-th sortKey="spent">Spent</v-th>
          <v-th defaultSort="asc" sortKey="remaining">Remaining</v-th>
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="row in displayData" :key="row.id">
            <td>{{ row.type }}</td>
            <td>{{ row.amount | formatCurrency }}</td>
            <td>{{ row.spent | formatCurrency }}</td>
            <td>{{ row.remaining | formatCurrency }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  computed: {
    leftInBudget() {
      let data = this.$store.state.Budgets.budgetByItems
      let items = []
      let catSum = []
      let styles = [
        'is-primary',
        'is-link',
        'is-info',
        'is-success',
        'is-warning',
        'is-danger'
      ]

      const Arr = data
      const Property = 'type'
      const amountByDate = _.groupBy(Arr, Property)
      const type = Object.keys(amountByDate)
      const omit = _.mapValues(amountByDate, x => x.map(y => _.omit(y, 'type')))
      const values = Object.values(omit)

      values.forEach(c => {
        let sumAmount = 0
        let sumSpent = 0
        let sumRemaining = 0
        c.forEach(t => {
          sumAmount = sumAmount + t.amount
          sumSpent = sumSpent + t.spent
          sumRemaining = sumRemaining + t.remaining
        })
        catSum.push({
          amount: sumAmount,
          spent: sumSpent,
          remaining: sumRemaining
        })
      })

      for (var i = 0; i < type.length; i++) {
        items.push({
          type: type[i],
          amount: catSum[i].amount,
          spent: catSum[i].spent,
          remaining: catSum[i].remaining,
          style: styles[i],
          percent: catSum[i].remaining / catSum[i].amount
        })
      }

      return items
    }
  },
  filters: {
    fomratNumber(val) {
      let number = Number(val)
      return number
    },
    formatCurrency(val) {
      let value = numeral(val).format('$0,0')
      return value
    },
    formatDate(val) {
      let date = moment(val).format('MMM Do, YY')
      return date
    },
    formatPercentage(val) {
      let percent = numeral(val).format('0%')
      return percent
    }
  }
}
</script>
