<template>
  <div id="home">
    <h1 class="title">Budget Performance Overview</h1>
    <p
      class="subtitle"
    >for {{ budgetDates[0].start | formatDate }} to {{ budgetDates[0].end | formatDate }}</p>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-4">
        <article class="tile is-child notification is-primary">
          <p class="title is-4">Breakdown</p>
          <div class="content">
            <p>Budgeted income: {{ budgetTotals[0].income | formatCurrency }}</p>
            <p>Budgeted expenses: {{ budgetTotals[0].expenses | formatCurrency }}</p>
            <hr>
            <p>Budget net income: {{ netBudget.budgetNet | formatCurrency }}</p>
            <p>Current net income: {{ netBudget.currentNet | formatCurrency}}</p>
          </div>
        </article>
      </div>
      <div class="tile is-3 is-parent">
        <article class="tile is-child notification is-warning">
          <p class="title is-4">Expenses</p>
          <div class="content">
            <p>Spent: {{ expTotal | formatCurrency }}</p>
            <p>
              Remaining:
              <b>{{ Number(budgetTotals[0].expenses) - expTotal | formatCurrency }}</b>
            </p>
          </div>
          <p class="title is-4">Income</p>
          <div class="content">
            <p>Earned: {{ incTotal | formatCurrency }}</p>
            <p>
              Balance:
              <b>{{ incTotal - budgetTotals[0].income | formatCurrency }}</b>
            </p>
          </div>
        </article>
      </div>
    </div>
    <div class="column is-8">
      <div class="column is-5">
        <h4 class="subtitle">Remaining budget:</h4>
        <div class="card">
          <footer class="card-footer">
            <p class="card-footer-item">
              <span
                class="tag is-large"
                v-bind:class="{'is-success': remaining.percent > 49, 'is-danger': remaining.percent < 50}"
              >{{remaining.remaining | formatCurrency}}</span>
            </p>
            <p class="card-footer-item">
              <span class="tag is-large is-light">{{(remaining.percent).toFixed(0)}}%</span>
            </p>
          </footer>
        </div>
      </div>
      <hr>
      <progress
        v-bind:class="{'is-success': remaining.percent > 49, 'is-warning': remaining.percent < 50 && remaining.percent > 24, 'is-danger': remaining.percent < 25}"
        class="progress is-large"
        v-bind:value="remaining.percent"
        max="100"
      ></progress>
    </div>
    <div class="buttons column">
      <a @click="showCharts" v-if="!this.charts" class="button has-background-info is-rounded">
        <span class="icon is-large has-text-white">
          <i class="fas fa-chart-line"></i>
        </span>
        <span class="has-text-white">Show Charts</span>
      </a>
      <a v-else @click="hideCharts" class="button has-background-danger is-rounded">
        <span class="icon is-large has-text-white">
          <i class="fas fa-chart-line"></i>
        </span>
        <span class="has-text-white">Hide Charts</span>
      </a>
    </div>
    <div class="columns margin-top" v-if="this.charts">
      <daily-expense></daily-expense>
      <category-pie></category-pie>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import moment from "moment";
  import numeral from 'numeral';
  import DailyExpense from "./charts/ExpenseChart";
  import CategoryPie from "./charts/CategoryPie";

  export default {
    created() {
      this.$store.dispatch("fetchBudgetTotals");
      this.$store.dispatch("fetchExpenseTotals");
      this.$store.dispatch("fetchDailyExpenses");
      this.$store.dispatch("fetchBudgetDates");
      this.$store.dispatch("fetchIncomes");
    },
    components: {
      DailyExpense,
      CategoryPie
    },
    computed: {
      ...mapState(["expTotal", "incTotal", "budgetTotals", "budgetDates"]),
      netBudget() {
        let state = this.$store.state;
        let budgetNet = state.budgetTotals[0].difference;
        let currentNet = state.income - state.expTotal;
        let diff = currentNet - budgetNet;

        if (diff > 0) {
          // eslint-disable-next-line
          this.positiveNet = true;
        }

        return {
          budgetNet: budgetNet,
          currentNet: currentNet,
          diff: diff
        };
      },
      remaining() {
        let expTotals = this.$store.state.expTotal;
        let budgetedExp = this.$store.state.budgetTotals[0].expenses;
        let remaining = Number(budgetedExp) - Number(expTotals);
        let percent = (remaining / budgetedExp) * 100;

        return {
          budgetedExp: budgetedExp,
          remaining: remaining,
          percent: percent
        };
      }
    },
    filters: {
      formatDate(val) {
        let date = moment(val).format("MMM Do, YYYY");
        return date;
      },
      formatCurrency(val) {
        let value = numeral(val).format("$0,0");
        return value;
      }
    },
    data() {
      return {
        charts: false,
        positiveNet: false
      };
    },
    methods: {
      showCharts() {
        this.charts = true;
      },
      hideCharts() {
        this.charts = false;
      }
    }
  };
</script>

