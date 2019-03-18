<template>
  <div>
    <p class="title is-4">Filter</p>
    <div class="level absolute">
      <div class="level-left">
        <div class="level-item">
          <div class="select">
            <select v-model="filters.type.value">
              <option disabled value>Select type</option>
              <option>Credit</option>
              <option>Loans</option>
              <option>Housing</option>
              <option>Transportation</option>
              <option>Family</option>
              <option>Insurance</option>
              <option>Personal</option>
            </select>
          </div>
        </div>
        <div class="level-item">
          <label class="checkbox">
            <input type="checkbox" v-model="filters.type.value" true-value />
            Show All
          </label>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-5">
        <div class="tile is-child notification is-primary">
          <p class="title">Expense Breakdown</p>
          <v-table
            :data="Expenses.expenses"
            :filters="filters"
            class="table is-fullwidth has-text-white"
          >
            <thead slot="head" class="has-text-white">
              <v-th sortKey="date" class="has-text-white">Date</v-th>
              <v-th sortKey="type" class="has-text-white">Expense</v-th>
              <th class="has-text-white">Expensee</th>
              <v-th sortKey="amount" class="has-text-white">Amount</v-th>
            </thead>
            <tbody slot="body" slot-scope="{ displayData }">
              <tr v-for="row in displayData" :key="row.id">
                <td>{{ row.date | formatDate }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.note }}</td>
                <td>{{ row.amount | formatCurrency }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
      <category-pie></category-pie>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'
import CategoryPie from './charts/CategoryPie.vue'

export default {
  components: {
    CategoryPie
  },
  created() {
    this.$store.dispatch('fetchExpenseTotals')
    this.$store.dispatch('fetchExpenses')
  },
  computed: {
    ...mapState(['Expenses', 'budgetStart']),
    getDateDiff(date) {
      let start = moment(this.$store.state.budgetStart)
      let end = moment(this.$store.state.budgetEnd)
      let expDate = moment(date)

      let startDiff = expDate.diff(start, 'days')
      let endDiff = expDate.diff(end, 'days')
      let value = ''

      if (startDiff > -1 && endDiff < 1) {
        value = true
      }

      return value
    }
  },
  data() {
    return {
      filters: {
        type: {
          value: '',
          keys: ['type']
        }
      },
      total: 0
    }
  },
  methods: {},
  filters: {
    formatDate(val) {
      let date = moment(val).format('MMM Do')
      return date
    },
    formatCurrency(val) {
      let value = numeral(val).format('$0,0')
      return value
    }
  }
}
</script>
