<template>
    <div>
        <div class="buttons is-right">
            <button @click="newBudget" class="button is-rounded is-warning">New budget</button>
        </div>
        <h2 class="title">Current Budget</h2>
        <div class="columns">
            <div class="column is-one-fifth">
                <Calendar/>
            </div>
            <v-table :data="budgetByItems" class="table is-bordered column is-hoverable budget-table is-two-thirds">
                <thead slot="head">
                    <v-th sortKey='date'>Expense Date</v-th>
                    <v-th sortKey='name'>Expense</v-th>
                    <v-th sortKey='amount'>Budgeted</v-th>
                    <v-th sortKey='spent'>Spent</v-th>
                    <th>Remaining</th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td>{{ row.date | formatDate }}</td>
                        <td>{{ row.name }}</td>
                        <td>{{ row.amount | formatCurrency}}</td>
                        <td>{{row.spent | formatCurrency}}</td>
                        <td>{{ (row.amount - row.spent) | formatCurrency }}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-table :data='budgetTotals' class="table is-bordered column">
                <thead slot="head">
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Surplus</th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td >{{row.income | formatCurrency}}</td>
                        <td>{{ row.expenses | formatCurrency }}</td>
                        <td>{{ row.difference | formatCurrency }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script>
import numeral from 'numeral';
import { mapState } from 'vuex';
import moment from 'moment';
import Calendar from './Calendar';
/* eslint-disable */
export default {
    components: {
        Calendar
    },
    created() {
        this.$store.dispatch('fetchBudgetItems')
        this.$store.dispatch('fetchBudgetTotals')
    },
    computed: {
        ...mapState(['budgetByItems', 'budgetTotals'])
    },
    data() {
        return {
        }
           
    },
    methods: {
        goHome() {
            this.$router.push('/')
        },
        newBudget() {
            this.$router.push('budget')
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
        },
        formatDate(val) {
            let date = moment(val).format('MMM Do, YY')
            return date
        }
    }
    
}
</script>

