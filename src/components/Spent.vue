<template>
  <v-card class="mt-5 ml-3 w-75">
    <v-sheet
      class="v-sheet--offset mx-auto pa-3"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-sparkline
        :labels="fillData.labels"
        :value="fillData.value"
        color="white"
        line-width="2"
        padding="16"
        smooth
        stroke-linecap="round"
      ></v-sparkline>
    </v-sheet>
    <v-card-text>
      <div class="title font-weight-bold mb-2">Expenses by day</div>
      <div class="subheading font-weight-light grey--text">
        {{ spentTotal | formatCurrency }} spent to date
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'
export default {
  computed: {
    fillData() {
      let state = this.$store.state.Expenses.expenses
      // let category = [];
      let amounts = []

      const Arr = state
      const Property = 'date'
      const amountByDate = _.groupBy(Arr, Property)
      const date = Object.keys(amountByDate)
      const omit = _.mapValues(amountByDate, x => x.map(y => _.omit(y, 'date')))
      const values = Object.values(omit)

      values.forEach(r => {
        let total = r.reduce(function(prev, curr) {
          return {
            amount: Number(prev.amount) + Number(curr.amount)
          }
        })

        amounts.push(total.amount)
      })

      let sorted = date.sort((a, b) => {
        return new Date(a) - new Date(b)
      })
      let formattedDate = []
      sorted.forEach(d => {
        formattedDate.push(moment(d).format('MMM Do'))
      })
      return {
        labels: formattedDate,
        value: amounts
      }
    },
    spentTotal() {
      let state = this.$store.state.Expenses.expTotal

      return state
    }
  },
  data() {
    return {}
  },
  methods: {},
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

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
