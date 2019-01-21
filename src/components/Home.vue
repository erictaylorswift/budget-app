<template>
    <div>
        <div>
            <h3>Income: {{ budgets[0].income | formatCurrency }}</h3>
            <h3>Expenses: {{ budgets[0].expenses | formatCurrency }}</h3>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
const numeral = require('numeral');

export default {
    created() {
        this.$store.dispatch('fetchBudget')
    },
    computed: {
        ...mapState(['budgets'])
    },
    filters: {
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    }
}
</script>

