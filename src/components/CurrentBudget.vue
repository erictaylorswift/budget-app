<template>
  <div class="container">
    <div class="tabs is-medium">
      <ul>
        <li v-bind:class="{ 'is-active': this.view == 'BudgetProgress' }">
          <a @click="switchView('BudgetProgress')">Progress Overview</a>
        </li>
        <li v-bind:class="{ 'is-active': this.view == 'BudgetTable' }">
          <a @click="switchView('BudgetTable')">Table View</a>
        </li>
      </ul>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <h2 class="title">Current Budget</h2>
      </div>
      <div class="control">
        <div class="buttons">
          <button @click="newBudget" class="button is-rounded is-warning">
            New budget
          </button>
        </div>
      </div>
    </div>
    <budget-overview></budget-overview>
    <component v-bind:is="view"></component>
  </div>
</template>

<script>
import numeral from 'numeral'
import { mapState } from 'vuex'
import moment from 'moment'
import Calendar from './Calendar'
import BudgetProgress from './BudgetProgress'
import BudgetTable from './BudgetTable'
import BudgetOverview from './CurrentBudgetOverview'
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

