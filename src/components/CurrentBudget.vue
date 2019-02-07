<template>
    <div>
        <button @click="newBudget" class="nes-btn is-warning top-right">New budget</button>
        <div class="flex middle">
            <h2 class="header space">Current Budget</h2>
        </div>
        <div class="flex">
            <v-table :data="current" class="nes-table is-bordered">
                <thead slot="head">
                    <v-th sortKey='type'>Type</v-th>
                    <v-th sortKey='amount' defaultSort='desc'>Amount</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td v-if="row.type != 'income'">{{ row.type }}</td>
                        <td v-if="row.type != 'income'">{{ row.amount | formatCurrency}}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-table :data='current' class="nes-table is-bordered">
                <thead slot="head">
                    <th>Income</th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td v-if="row.type == 'income'">{{row.amount | formatCurrency}}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script>
import numeral from 'numeral';
import { mapState } from 'vuex';

export default {
    created() {
        this.$store.dispatch('fetchBudget')
        this.$store.dispatch('fetchCurrentBudget')
        
    },
    computed: {
        ...mapState(['current', 'budgets'])
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
        }
    }
    
}
</script>

