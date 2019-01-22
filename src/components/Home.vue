<template>
    <div>
        <div>
            <h3>Budgeted income: {{ budgets[0].income | formatCurrency }}</h3>
            <h3>Budgeted expenses: {{ budgets[0].expenses | formatCurrency }}</h3>
        </div>
        <div>
            <h3>Expenses</h3>
            <ul>
                <li>
                    Spent: {{ expenses | formatCurrency }}
                </li>
                <li>
                    Remaining: {{ budgets[0].expenses - expenses | formatCurrency }}
                </li>
            </ul>
            <h3>Income</h3>
            <ul>
                <li>
                    Earned: {{ incomes | formatCurrency }}
                </li>
                <li>
                    Outstanding: {{ budgets[0].income - incomes | formatCurrency }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
const numeral = require('numeral');

export default {
    created() {
        this.$store.dispatch('fetchBudget')
        this.$store.dispatch('fetchIncome')
    },
    computed: {
        ...mapState(['budgets', 'expenses', 'incomes'])
    },
    filters: {
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    }
}
</script>

