<template>
    <div>
        <router-link to="expenses">View expenses</router-link>
        <h4>{{ budgets[0].start }}</h4>
        <Budget></Budget>
        <div class="nes-container with-title three-quarters">
            <h2 class="title">Enter income</h2>
            <Income></Income>
        </div>
        <div class="nes-container with-title">
            <h2 class="title">Enter Expenses</h2>
            <Expenses></Expenses>
        </div>
        <div>
            <Home></Home>
        </div>
    </div>
</template>

<script>
import Expenses from './Expenses';
import Budget from './Budget';
import Home from './Home';
import Income from './Income';
import { mapState } from 'vuex'
import moment from 'moment'
 
export default {
    components: {
        Budget,
        Expenses,
        Income,
        Home
    },
    computed: {
        ...mapState(['budgets', 'expenses'])
    },
    data() {
        return {
            budgetStart: null,
        }
    },
    created() {
        this.$store.dispatch('fetchBudget')
    }
}
</script>

