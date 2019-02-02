<template>
    <div class="flex-column" id="home">
        <h2 class="header">Budget for {{ budgets[0].start | formatDate }} to {{ budgets[0].end | formatDate }}</h2>
        <div class="flex">
            <div class="nes-container">
                <h2 class="title">Breakdown</h2>
                <div>
                    <p>Budgeted income: {{ budgets[0].income | formatCurrency }}</p>
                    <p>Budgeted expenses: {{ budgets[0].expenses | formatCurrency }}</p>      
                    <hr>
                    <p>Budget net income: {{ budgets[0].income - budgets[0].expenses | formatCurrency }}</p>
                    <p>Current net income: {{ (incomes - expenseTotal) | formatCurrency }}</p>
                </div>
            </div>
            <div class="nes-container">
                <h3 class="title">Perfomance</h3>
                <div class="messages">
                    <div class="message -left flex align-baseline" v-if="((incomes - expenseTotal) - (budgets[0].income - budgets[0].expenses)) > 0">
                        <i class="nes-icon trophy is-medium"></i>
                        <div class="nes-balloon from-left">
                            <p style="color: green">
                                {{ (incomes - expenseTotal) - (budgets[0].income - budgets[0].expenses) | formatCurrency }} ahead of budget
                            </p>
                        </div>
                    </div>
                    <div class="message -left flex align-baseline" v-else>
                        <i class="nes-bulbasaur is-medium"></i>
                        <div class="nes-balloon from-left">
                            <p>
                                {{ (incomes - expenseTotal) - (budgets[0].income - budgets[0].expenses) | formatCurrency }} behind budget
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class="nes-container flex">
                <i class="nes-mario"></i>
                <div class="lists">
                    <h3>Expenses</h3>
                    <ul class="nes-list is-disc">
                        <li>
                            Spent: {{ expenseTotal | formatCurrency }}
                        </li>
                        <li>
                            Remaining: <b>{{ budgets[0].expenses - expenseTotal | formatCurrency }}</b>
                        </li>
                    </ul>
                </div>
                <div class="lists">
                    <h3>Income</h3>
                    <ul class="nes-list is-disc">
                        <li>
                            Earned: {{ incomes | formatCurrency }}
                        </li>
                        <li>
                            Balance: <b>{{ incomes - budgets[0].income | formatCurrency }}</b>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
const numeral = require('numeral');

export default {
    beforeCreate() {
        this.$store.dispatch('fetchBudget')
        this.$store.dispatch('fetchIncome')
        this.$store.dispatch('fetchExpenses')
    },
    computed: {
        ...mapState(['budgets', 'expenses', 'incomes', 'expectedExpenses']),
        expenseTotal() {
            let expenses = this.$store.state.expenses;
            let start = this.$store.state.budgets[0].start;
            let end = this.$store.state.budgets[0].end;

            let total = 0;

            for (var i = 0; i < expenses.length; i++) {
                if (expenses[i].date >= start && expenses[i].date <= end) {
                    total = total + expenses[i].amount
                }
            }

            return total;
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
            
        }
    }
}
</script>

