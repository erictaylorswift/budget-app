<template>
  <div class="mt-5 ml-3 w-75">
    <v-card>
      <v-card-text>
        <div
          v-for="category in leftInBudget"
          :key="category.name"
          class="margin-top"
        >
          <div class="flex">
            <p class="title">
              {{ category.type }} --
              <strong>{{ category.spent | formatCurrency }}</strong>
              |
              <small>{{ category.percent | formatPercentage }} remaining</small>
            </p>
          </div>
          <v-progress-linear
            :value="category.percent * 100"
            height="15"
            :color="category.style"
          ></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import numeral from 'numeral'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  created() {
    this.$store.dispatch('fetchBudgetTotals')
    this.$store.dispatch('fetchBudgetItems')
  },
  computed: {
    ...mapState(['Budgets']),
    leftInBudget() {
      let data = this.$store.state.Budgets.budgetByItems
      let items = []
      let catSum = []
      let styles = [
        'purple darken-1',
        'pink accent-2',
        'indigo',
        'teal accent-4',
        'deep-orange darken-2'
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

      items.sort((a, b) => {
        return a.remaining - b.remaining
      })

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
