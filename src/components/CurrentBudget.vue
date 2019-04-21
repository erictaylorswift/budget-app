<template>
  <div class="ml-5 mt-4">
    <v-tabs color="grey lighten-5" class=" ml-3">
      <v-tabs-slider color="purple accent-3"></v-tabs-slider>
      <v-tab @click="switchView('BudgetProgress')">Progress Overview</v-tab>
      <v-tab @click="switchView('BudgetTable')">Table view</v-tab>
      <v-tab @click="switchView('Calendar')">Calendar view</v-tab>
    </v-tabs>
    <section>
      <div class="ml-3 mt-0">
        <h1 class="display-2 purple--text text--darken-4 pb-2">Your budget</h1>
        <h2 class="subheading grey--text ml-2">
          {{ Budgets.budgetDates.start | formatDate }} to
          {{ Budgets.budgetDates.end | formatDate }}
        </h2>
      </div>
      <budget-overview></budget-overview>
      <component v-bind:is="view"></component>
    </section>
  </div>
</template>

<script>
import numeral from 'numeral'
import { mapState } from 'vuex'
import moment from 'moment'
import Calendar from './Calendar'
import BudgetProgress from './BudgetProgress'
import BudgetTable from './BudgetTable'
import BudgetOverview from './BudgetOverview'
/* eslint-disable */
  export default {
    created() {
      this.$store.dispatch('fetchBudgetTotals')
      this.$store.dispatch('fetchBudgetItems')
    },
    components: {
      Calendar,
      BudgetProgress,
      BudgetTable,
      BudgetOverview
    },
    computed: {
      ...mapState(['Budgets'])
    },
    data() {
      return {
        view: 'BudgetProgress'
      }
    },
    methods: {
      goHome() {
        this.$router.push('/')
      },
      newBudget() {
        this.$router.push('budget')
      },
      switchView(name) {
        this.view = name
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

