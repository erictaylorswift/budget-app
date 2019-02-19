<template>
    <div id="home">
        <div class="tile is-ancestor">
            <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-primary">
                        <p class="title is-4">
                            Breakdown
                        </p>
                        <p class="subtitle is-5">
                            Budget for {{ budgets[0].start | formatDate }} to {{ budgets[0].end | formatDate }}
                        </p>
                        <div class="content">
                            <p>Budgeted income: {{ budgets[0].income | formatCurrency }}</p>
                            <p>Budgeted expenses: {{ budgets[0].bills | formatCurrency }}</p>
                            <hr>      
                            <p>Budget net income: {{ netBudget.budgetNet | formatCurrency }}</p>
                            <p>Current net income: {{ netBudget.currentNet | formatCurrency}}</p>
                        </div>
                    </article>
            </div>
            <div class="tile is-3 is-parent">
                <article class="tile is-child notification is-warning">
                    <p class="title is-4">
                        Expenses
                    </p>
                    <div class="content">
                        <p>Spent: {{ expTotal | formatCurrency }}</p>
                        <p> Remaining: <b>{{ Number(budgets[0].bills) - expTotal | formatCurrency }}</b></p>
                    </div>
                    <p class="title is-4">
                        Income
                    </p>
                    <div class="content">
                        <p>Earned: {{ income | formatCurrency }}</p>
                        <p>Balance: <b>{{ income - budgets[0].income | formatCurrency }}</b> </p>
                    </div>
                </article>
            </div>
        </div>
        <div>
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
        <div class="flex margin-top" v-if="this.charts">
            <daily-expense></daily-expense>
            <category-pie></category-pie>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import DailyExpense from './charts/ExpenseChart'
import CategoryPie from './charts/CategoryPie'
const numeral = require('numeral');

export default {
    components: {
        DailyExpense,
        CategoryPie
    },
    computed: {
        ...mapState(['budgets', 'expTotal', 'income', 'remaining']),
        netBudget() {
            let state = this.$store.state;
            let budgetNet = state.budgets[0].income - state.budgets[0].bills;
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
           this.charts = true;
       },
       hideCharts() {
           this.charts = false
       }
    }
}
</script>

