<template>
    <div>
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
            this.$store.dispatch('fetchDailyExpenses')
        }).then(() => {
            this.$store.dispatch('fetchExpenseCategory')
        }).then(() => {
            this.$store.dispatch('fetchExpenseTotals')
        }).then(() => {
            this.$store.dispatch('fetchIncome')
        }).then(() => {
            this.$store.dispatch('fetchCurrentBudget')
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
        
    }
}
</script>

