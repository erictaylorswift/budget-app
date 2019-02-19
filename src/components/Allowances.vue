<template>
    <div>
        <h3>Misc. Expenses</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Expensee</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="allowance in allowances" 
                    :key="allowance.id">
                    <td v-if="allowance.date >= budgets[0].start && allowance.date <= budgets[0].end">
                        {{ allowance.date | formatDate }}
                    </td>
                    <td v-if="allowance.date >= budgets[0].start && allowance.date <= budgets[0].end">
                        {{ allowance.allowance }}
                    </td>
                    <td v-if="allowance.date >= budgets[0].start && allowance.date <= budgets[0].end">
                        {{ allowance.amount | formatCurrency }}
                    </td>
                </tr>
                <tr>
                    <td style="border-right: none;"></td>
                    <td></td>
                    <td style="background-color: black; color: white;">
                        {{ this.total | formatCurrency }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import numeral from 'numeral'

export default {
    created() {
        this.$store.dispatch('fetchAllowances')
    },
    updated() {
        let allowances = this.$store.state.allowances;
        let budgetStart = this.$store.state.budgets[0].start;
        let budgetEnd = this.$store.state.budgets[0].end;
        let total = 0;

        for (var i = 0; i < allowances.length; i++) {
           if (allowances[i].date >= budgetStart && allowances[i].date <= budgetEnd ) {
               total = total + allowances[i].amount
           }
        }

        this.total = total;
    },
    computed: {
        ...mapState(['allowances', 'budgets'])
    },
    data() {
        return {
            total: null
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
    }
}
</script>

