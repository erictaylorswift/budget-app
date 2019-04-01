<template>
  <div id="home" class="container">
    <h1 class="title">Budget Performance Overview</h1>
    <p class="subtitle">
      for {{ budgetStart | formatDate }} to
      {{ budgetEnd | formatDate }}
    </p>
    <vs-row vs-justify="center">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
        <vs-card>
          <div slot="header">
            <h3>Budgeted income</h3>
          </div>
          <div>
            <p>{{ Budgets.budgetTotals[0].income | formatCurrency }}</p>
          </div>
        </vs-card>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
        <vs-card>
          <div slot="header">
            <h3>Budgeted expenses</h3>
          </div>
          <div>
            <p>{{ Budgets.budgetTotals[0].expenses | formatCurrency }}</p>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-w="12">
        <div class="tile is-ancestor">
          <a @click="toExpenses" class="tile is-parent">
            <article
              class="tile is-child notification is-info has-text-centered"
            >
              <p class="title is-4">Expenses</p>
              <div class="content">
                <p>Spent: {{ Expenses.expTotal | formatCurrency }}</p>
                <p>
                  Remaining:
                  <b>
                    {{
                      (Number(Budgets.budgetTotals[0].expenses) -
                        Expenses.expTotal)
                        | formatCurrency
                    }}
                  </b>
                </p>
              </div>
            </article>
          </a>
          <div class="tile is-parent">
            <article
              class="tile is-child notification is-warning has-text-centered"
            >
              <p class="title is-4">Income</p>
              <div class="content">
                <p>Earned: {{ incTotal | formatCurrency }}</p>
                <p>
                  Balance:
                  <b>
                    {{
                      (incTotal - Budgets.budgetTotals[0].income)
                        | formatCurrency
                    }}
                  </b>
                </p>
              </div>
            </article>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-3">
        <article class="tile is-child">
          <calendar />
        </article>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child">
          <div class="box">
            <div class="tile is-ancestor">
              <div class="tile is-parent">
                <article class="tile is-child">
                  <p class="title is-4 margin-top">Remaining budget</p>
                  <p class="subtitle">
                    {{ remaining.remaining | formatCurrency }} |
                    {{ remaining.percent.toFixed(0) }}%
                  </p>
                  <progress
                    v-bind:class="{
                      'is-success': remaining.percent > 49,
                      'is-warning':
                        remaining.percent < 50 && remaining.percent > 24,
                      'is-danger': remaining.percent < 25
                    }"
                    class="progress is-large"
                    v-bind:value="remaining.percent"
                    max="100"
                  ></progress>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child">
          <div class="box">
            <daily-expense></daily-expense>
          </div>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child">
          <div class="box">
            <category-pie></category-pie>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'
import DailyExpense from './charts/ExpenseChart'
import CategoryPie from './charts/CategoryPie'
import Calendar from './Calendar'

export default {
  components: {
    DailyExpense,
    CategoryPie,
    Calendar
  },
  computed: {
    ...mapState([
      'Expenses',
      'Budgets',
      'incTotal',
      'budgetStart',
      'budgetEnd'
    ]),
    netBudget() {
      let state = this.$store.state
      let budgetNet = state.Budgets.budgetTotals[0].difference
      let currentNet = state.incTotal - state.Expenses.expTotal
      let diff = currentNet - budgetNet

      if (diff > 0) {
        // eslint-disable-next-line
          this.positiveNet = true
      }

      return {
        budgetNet: budgetNet,
        currentNet: currentNet,
        diff: diff
      }
    },
    remaining() {
      let expTotals = this.$store.state.Expenses.expTotal
      let budgetedExp = this.$store.state.Budgets.budgetTotals[0].expenses
      let remaining = Number(budgetedExp) - Number(expTotals)
      let percent = (remaining / budgetedExp) * 100

      return {
        budgetedExp: budgetedExp,
        remaining: remaining,
        percent: percent
      }
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
  },
  data() {
    return {
      charts: false,
      positiveNet: false
    }
  },
  methods: {
    showCharts() {
      this.charts = true
    },
    hideCharts() {
      this.charts = false
    },
    toExpenses() {
      this.$router.push('expenses')
    }
  }
}
</script>
