<template>
  <v-card class="mt-5 w-75 ml-3">
    <v-card-text>
      <v-data-table
        :items="items"
        :headers="headers"
        hide-actions
        :pagination.sync="sort"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.amount | formatCurrency }}</td>
            <td>{{ props.item.spent | formatCurrency }}</td>
            <td>{{ props.item.remaining | formatCurrency }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import numeral from 'numeral'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  created() {
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

    this.items = items
  },
  data() {
    return {
      headers: [
        { text: 'Expense', align: 'left', sortable: false, value: 'type' },
        { text: 'Budgeted', value: 'amount' },
        { text: 'Spent', value: 'spent' },
        { text: 'Remainging', value: 'remaining' }
      ],
      items: [],
      sort: {
        sortBy: 'remaining'
      }
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
