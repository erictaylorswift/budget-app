<template>
    <div class="flex-column margin-top">
        <div class="flex center-middle">
            <h4>Budgeted income: {{ budgets[0].income | formatCurrency }}</h4>
            <h4>Budgeted expenses: {{ budgets[0].expenses | formatCurrency }}</h4>
        </div>
        <div class="flex">
            <div class="nes-container with-title half flex">
                <i class="title nes-mario sm-icon"></i>
                <div class="lists">
                    <h3>Expenses</h3>
                    <ul class="nes-list is-disc">
                        <li>
                            Spent: {{ this.expenseTotal | formatCurrency }}
                        </li>
                        <li>
                            Remaining: <b>{{ budgets[0].expenses - this.expenseTotal | formatCurrency }}</b>
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
            <div class="nes-container with-title one-third flex-column">
                <h3>Perfomance</h3>
                <div class="messages">
                    <div class="message -left flex align-baseline" v-if="((incomes - this.expenseTotal) - (budgets[0].expenses - this.expenseTotal)) > 0">
                        <i class="nes-icon trophy is-medium"></i>
                        <div class="nes-balloon from-left">
                            <p style="color: green">
                                {{ (incomes - this.expenseTotal) - (budgets[0].expenses - this.expenseTotal) | formatCurrency }} ahead of budget
                            </p>
                        </div>
                    </div>
                    <div class="message -left flex align-baseline" v-else>
                        <i class="nes-bulbasaur is-medium"></i>
                        <div class="nes-balloon from-left">
                            <p>
                                {{ (incomes - this.expenseTotal) - (budgets[0].expenses - this.expenseTotal) | formatCurrency }} behind budget
                            </p>
                        </div>
                    </div>
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
    updated() {
        let expenses = this.$store.state.expenses;
        let start = this.$store.state.budgets[0].start;
        let end = this.$store.state.budgets[0].end;

        let total = 0;

        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].date >= start && expenses[i].date <= end) {
                total = total + expenses[i].amount
            }
        }

        this.expenseTotal = total;
    },
    computed: {
        ...mapState(['budgets', 'expenses', 'incomes', 'expectedExpenses'])
    },
    filters: {
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    },
    data() {
        return {
            'expenseTotal': 0
        }
    }
}
</script>

