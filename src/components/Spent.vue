<template>
  <v-card class="mt-5 ml-3 w-75">
    <v-sheet
      class="v-sheet--offset mx-auto pa-3"
      color="grey darken-3"
      elevation="12"
      max-width="calc(100% - 32px)"
      min-height="180px"
    >
      <v-sparkline
        :labels="fillData.labels"
        :value="fillData.value"
        :fill="true"
        color="white"
        line-width="2"
        padding="20"
        smooth="25"
        auto-draw
        :gradient="gradient"
        :gradient-direction="gradDirection"
        stroke-linecap="round"
        label-size="5px"
      ></v-sparkline>
    </v-sheet>
    <v-card-text>
      <div class="title font-weight-bold mb-2 ml-2">
        Expenses by day |
        <span class="subheading font-weight-light grey--text ml-2"
          >{{ spentTotal | formatCurrency }} spent to date</span
        >
      </div>
      <v-chip
        v-for="item in spentByDay"
        :key="item"
        class="mt-2"
        color="teal"
        text-color="white"
      >
        <strong>{{ item.label }}</strong
        >&nbsp;
        <span>({{ item.value | formatCurrency }})</span>
      </v-chip>
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
    },
    spentByDay() {
      let labels = this.fillData.labels
      let values = this.fillData.value

      return labels.map((l, i) => {
        return {
          label: l,
          value: values[i]
        }
      })
    }
  },
  data() {
    return {
      gradient: ['#f72047', '#ffd200', '#1feaea'],
      gradDirection: 'top'
    }
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
