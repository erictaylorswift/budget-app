<template>
    <div class="">
        <p class="title is-4">Filter</p>
        <div class="level absolute">
            <div class="level-left">
                <div class="level-item">
                    <div class="select">
                        <select v-model="filters.type.value" >
                            <option disabled value="">Select Type</option>
                            <option>Groceries</option>
                            <option>Bills</option>
                            <option>Allowances</option>
                            <option>Savings</option>
                            <option>Child Care</option>
                            <option>Prescriptions</option>
                            <option>Rent</option>
                        </select>
                    </div>
                </div>
                <div class="level-item">
                    <label class="checkbox">
                        <input type="checkbox" v-model="filters.type.value" true-value=""/>
                        Show All
                    </label>
                </div>
            </div>
        </div>
        <div class="tile is-ancestor">
            <div class="tile is-parent is-6">
                <div class="tile is-child notification is-primary">
                    <p class="title"> Expense Breakdown</p>
                    <v-table :data="expenses" :filters='filters' class="table is-fullwidth has-text-white">
                        <thead slot="head" class="has-text-white">
                            <v-th sortKey="date" class="has-text-white">Date</v-th>
                            <v-th sortKey="type" class="has-text-white">Expense</v-th>
                            <th class="has-text-white">Category</th>
                            <th class="has-text-white">Expensee</th>
                            <v-th sortKey="amount" class="has-text-white">Amount</v-th>
                        </thead>
                        <tbody slot="body" slot-scope="{displayData}">
                            <tr v-for="row in displayData" :key="row.id">
                                <td v-if="getDateDiff(row.date)">{{ row.date | formatDate }}</td>
                                <td v-if="getDateDiff(row.date)">{{ row.type }}</td>
                                <td v-if="getDateDiff(row.date)">{{ row.category }}</td>
                                <td v-if="getDateDiff(row.date)">{{ row.note }}</td>
                                <td v-if="getDateDiff(row.date)">{{ row.amount | formatCurrency }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </div>
            <div class="tile is-parent is-4">
                <div class="tile is-child notification is-info">
                    <p class="title">Totals</p>
                    <v-table :data="expenseCategory" :filters='filters' class="table is-fullwidth has-text-white">
                        <thead slot="head">
                            <th></th>
                            <th class="has-text-white">Total Spent</th>
                            <th class="has-text-white">Remaining</th>
                        </thead>
                        <tbody slot="body" slot-scope="{displayData}">
                            <tr v-for="row in displayData" :key="row.id">
                                <td>{{ row.type }}</td>
                                <td>{{ row.spent | formatCurrency }}</td>
                                <td>{{ row.remaining | formatCurrency }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </div>
            
            
        </div>
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
            let date = moment(val).format('MMM Do')
            return date
        },
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    }
}
</script>

