<template>
    <div>
        <a @click="goHome" class="top-right flex middle">
            <i class="nes-logo"></i>
            Home
        </a>
        <form @submit.prevent>
            <div class="flex middle">
                <label>Bills</label>
                <input type="number" v-model="budgets[0].bills">
                <label>Budgeted income</label>
                <input v-model="budgets[0].income">
                <p>{{ Number(budgets[0].income) - Number(budgets[0].bills) | formatCurrency }}</p>
            </div>
        </form>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import numeral from 'numeral';
import { mapState } from 'vuex';
const fb = require('../firebaseConfig')

export default {
    created() {
        this.$store.dispatch('fetchBudget')
    },
    computed: {
        ...mapState(['budgets'])
    },
    components: {
        Datepicker
    },
    data() {
        return {}
           
    },
    methods: {
        goHome() {
            this.$router.push('/')
        }
    },
    filters: {
        fomratNumber(val) {
            let number = Number(val)
            return number
        },
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    }
    
}
</script>

