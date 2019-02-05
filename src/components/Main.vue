<template>
    <div>
        <div class="flex space-between half margin-bottom">
            <button @click="newBudget" class="nes-btn is-warning">New budget</button>
            <button @click="newIncome" class="nes-btn is-primary">Add income</button>
            <button @click="newExpense" class="nes-btn is-primary">Add expense</button>
        </div>
        <div class="top-right flex middle">
            <i class="nes-logo"></i>
            <a @click="viewExpenses">
                View expenses
            </a>
            <a @click="currentBudget">Current Budget</a>
            <a @click="expenseChart">View Charts</a>
        </div>
        <Expenses></Expenses>
        <Income></Income>
        <Home></Home>
    </div>
</template>

<script>
import Expenses from './Expenses';
import Home from './Home';
import Income from './Income';
 
export default {
    created() {
        this.$store.dispatch('fetchBudget').then(() => {
            this.$store.dispatch('fetchDailyExpense')
        }).then(() => {
            this.$store.dispatch('fetchExpenseCategory')
        }).then(() => {
            this.$store.dispatch('fetchExpenseTotals')
        }).then(() => {
            this.$store.dispatch('fetchIncome')
        }).then(() => {
            this.$store.dispatch('fetchDailyExpenses')
        })
    },
    components: {
        Expenses,
        Income,
        Home
    },
    data() {
        return {
            budgetStart: null,
        }
    },
    methods: {
        newExpense() {
            this.$modal.show('expense-modal')
        },
        newBudget() {
            this.$router.push('budget')
        },
        viewExpenses() {
            this.$router.push('expenses')
        },
        currentBudget() {
            this.$router.push('current-budget')
        },
        newIncome() {
            this.$modal.show('income-modal')
        },
        expenseChart() {
            this.$router.push('/charts/daily-expenses')
        }
    }
}
</script>

