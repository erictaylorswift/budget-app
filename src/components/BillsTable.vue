<template>
  <div class="container fluid ml-3">
    <h1 class="display-2">Expense breakdown</h1>
    <v-card class="mt-3 w-75" color="purple">
      <v-card-title>
        <v-layout row wrap justify-end>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="search"
              single-line
              solo-inverted
              hint="Search for expense type or source"
              persistent-hint
              dark
              color="purple"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :items="Expenses.expenses"
          :headers="headers"
          :pagination.sync="pagination"
          :search="search"
          class="elevation-10"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.date | formatDate }}</td>
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.note }}</td>
              <td>{{ props.item.amount | formatCurrency }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'

export default {
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
      search: '',
      total: 0,
      headers: [
        { text: 'Date', align: 'left', value: 'date' },
        { text: 'Expense', align: 'left', value: 'type' },
        { text: 'Expense source', align: 'left', value: 'note' },
        { text: 'Amount', align: 'left', value: 'amount' }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'date',
        descending: true
      }
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
