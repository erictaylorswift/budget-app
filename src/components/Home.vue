<template>
    <div class="flex-column margin-top">
        <div class="flex center-middle">
            <h4>Budgeted income: {{ budgets[0].income | formatCurrency }}</h4>
            <h4>Budgeted expenses: {{ budgets[0].expenses | formatCurrency }}</h4>
        </div>
        <div class="nes-container with-title half flex">
            <i class="title nes-mario sm-icon"></i>
            <div class="lists">
                <h3>Expenses</h3>
                <ul class="nes-list is-disc">
                    <li>
                        Spent: {{ expenses | formatCurrency }}
                    </li>
                    <li>
                        Remaining: <b>{{ budgets[0].expenses - expenses | formatCurrency }}</b>
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
                        Outstanding: <b>{{ budgets[0].income - incomes | formatCurrency }}</b>
                    </li>
                </ul>
            </div>
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

