<template>
    <div class="flex-column" id="home">
        <h2 class="header">Budget for {{ budgets[0].start | formatDate }} to {{ budgets[0].end | formatDate }}</h2>
        <div class="flex">
            <div class="nes-container">
                <h2 class="title">Breakdown</h2>
                <div>
                    <p>Budgeted income: {{ budgets[0].income | formatCurrency }}</p>
                    <p>Budgeted expenses: {{ budgets[0].bills | formatCurrency }}</p>      
                    <hr>
                    <p>Budget net income: {{ netBudget.budgetNet | formatCurrency }}</p>
                    <p>Current net income: {{ netBudget.currentNet | formatCurrency}}</p>
                </div>
            </div>
            <div class="message-container">
                <div class="messages">
                    <div class="message -left flex align-baseline">
                        <div class="nes-balloon from-left">
                            <p>
                                You are 
                                    <span v-bind:class="{ 
                                            positive: positiveNet, 
                                            negative: !positiveNet
                                        }">
                                        {{ netBudget.diff | formatCurrency }}
                                    </span> 
                                ahead of budget
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex middle">
            <div class="nes-container flex">
                <i class="nes-icon coin is-large"></i>
                <div class="lists">
                    <h3>Expenses</h3>
                    <ul class="nes-list is-disc">
                        <li>
                            Spent: {{ expTotal | formatCurrency }}
                        </li>
                        <li>
                            Remaining: <b>{{ Number(budgets[0].bills) - expTotal | formatCurrency }}</b>
                        </li>
                    </ul>
                </div>
                <div class="lists">
                    <h3>Income</h3>
                    <ul class="nes-list is-disc">
                        <li>
                            Earned: {{ income | formatCurrency }}
                        </li>
                        <li>
                            Balance: <b>{{ income - budgets[0].income | formatCurrency }}</b>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="space">
                <a @click="showCharts" v-if="!this.charts">
                    <i class="nes-pokeball"></i>
                </a>
                <a v-else @click="hideCharts">
                    <i class="nes-squirtle"></i>
                </a>
            </div>
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

