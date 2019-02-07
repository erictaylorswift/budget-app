<template>
    <div>
        <div class="flex space-between half margin-bottom">
            <button @click="newIncome" class="nes-btn is-primary">Add income</button>
            <button @click="newExpense" class="nes-btn is-primary">Add expense</button>
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
import Nav from './Nav'
 
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
        Home,
        Nav
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
        newIncome() {
            this.$modal.show('income-modal')
        }
    }
}
</script>

