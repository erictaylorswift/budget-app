<template>
  <v-card class="mt-5 w-75 ml-3">
    <v-calendar
      type="custom-weekly"
      :start="Budgets.budgetDates.start"
      :end="Budgets.budgetDates.end"
      color="purple darken-2"
    >
      <template slot="day" slot-scope="{ date }">
        <template v-for="event in eventsMap[date]">
          <v-menu :key="event.note" v-model="event.open" full-width offset-x>
            <template slot="activator" slot-scope="{ on }">
              <div v-on="on" class="my-event">
                {{ event.note }}
                <v-icon small right>more_horiz</v-icon>
              </div>
            </template>
            <v-card flat>
              <v-toolbar>
                <v-toolbar-title v-html="event.note"></v-toolbar-title>
              </v-toolbar>
              <v-card-title primary-title>
                <span v-html="event.type"></span><v-spacer></v-spacer>
                <span>{{ event.amount | formatCurrency }}</span>
              </v-card-title>
            </v-card>
          </v-menu>
        </template>
      </template>
    </v-calendar>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'
import moment from 'moment'
export default {
  data() {
    return {
      today: new Date()
    }
  },
  created() {
    this.$store.dispatch('fetchBudgetItems')
  },
  computed: {
    ...mapState(['Budgets', 'Expenses']),
    attributes() {
      let items = this.$store.state.Expenses.expenses
      return [
        ...items.map(res => ({
          dates: moment(res.date).format('YYYY-MM-DD'),
          highlight: 'red',
          customData: res,
          popover: {
            slot: 'expense-row',
            visibility: 'hover',
            label: res.note
          }
        }))
      ]
    },
    eventsMap() {
      let events = this.$store.state.Expenses.expenses
      const map = {}
      events.forEach(e =>
        (map[moment(e.date).format('YYYY-MM-DD')] =
          map[moment(e.date).format('YYYY-MM-DD')] || []).push(e)
      )
      return map
    }
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
