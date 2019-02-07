<template>
    <div class="flex">
        <div class="flex absolute">
            <label>Filter by Expense Type:</label>
            <select v-model="filters.type.value" >
                <option disabled value="">Select Type</option>
                <option>Groceries</option>
                <option>Bills</option>
                <option>Allowances</option>
                <option>Savings</option>
                <option>Child Care</option>
                <option>Prescriptions</option>
                <option>Rent</option>
                <option></option>
            </select>
        </div>
        <div class="flex-column">
            <v-table :data="expenses" :filters='filters' class="nes-table is-bordered">
                <thead slot="head">
                    <v-th sortKey="date">Date</v-th>
                    <v-th sortKey="type">Expense</v-th>
                    <th>Category</th>
                    <th>Expensee</th>
                    <v-th sortKey="amount">Amount</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td v-if="getDateDiff(row.date)">{{ row.date }}</td>
                        <td v-if="getDateDiff(row.date)">{{ row.type }}</td>
                        <td v-if="getDateDiff(row.date)">{{ row.category }}</td>
                        <td v-if="getDateDiff(row.date)">{{ row.note }}</td>
                        <td v-if="getDateDiff(row.date)">{{ row.amount | formatCurrency }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <v-table :data="expenseCategory" class="nes-table is-bordered">
            <thead slot="head">
                <th>Category</th>
                <th>Total</th>
            </thead>
            <tbody slot="body" slot-scope="{displayData}">
                <tr v-for="row in displayData" :key="row.id">
                    <td>{{ row.category }}</td>
                    <td>{{ row.amount | formatCurrency }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import numeral from 'numeral'

export default {
    created() {
        this.$store.dispatch('fetchBudget')
        this.$store.dispatch('fetchExpenses')
        this.$store.dispatch('fetchExpenseTotals')
        this.$store.dispatch('fetchExpenseCategory')
    },
    computed: {
        ...mapState(['budgets', 'expenses', 'expTotal', 'expenseCategory'])
    },
    data() {
       return {
            filters: {
                type: { 
                    value: '', 
                    keys: ['type']
                }
            },
            total: 0
        }
    },
    methods: {
        getDateDiff(date) {
            let start = moment(this.$store.state.budgets[0].start)
            let end = moment(this.$store.state.budgets[0].end)
            let expDate = moment(date)

            let startDiff = expDate.diff(start, 'days')
            let endDiff = expDate.diff(end, 'days')

            if (startDiff > -1 && endDiff < 1) {
                return true
            }
        },
        getTotals(amount) {
            let value = amount
            let array = []

            array.push(value)

            let total = array.reduce((a,b) => a + b, 0)

            return total
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

