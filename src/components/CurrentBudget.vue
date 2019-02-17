<template>
    <div>
        <button @click="newBudget" class="nes-btn is-warning top-right">New budget</button>
        <div class="flex middle">
            <h2 class="header space">Current Budget</h2>
        </div>
        <div class="flex">
            <v-table :data="expenseCategory" class="nes-table is-bordered">
                <thead slot="head">
                    <v-th sortKey='tpe'>Category</v-th>
                    <v-th sortKey='budgeted'>Budgeted</v-th>
                    <v-th sortKey='spent' defaultSort='desc'>Spent</v-th>
                    <v-th sortKey='remaining' >Remaining</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                        <td v-if="row.type != 'income' && row.type != 'bills'">{{ row.type }}</td>
                        <td v-if="row.type != 'income' && row.type != 'bills'">{{ row.budgeted | formatCurrency}}</td>
                        <td v-if="row.type != 'income' && row.type != 'bills'">{{ row.spent | formatCurrency}}</td>
                        <td v-if="row.type != 'income' && row.type != 'bills'">{{ row.remaining | formatCurrency}}</td>
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
            <v-table></v-table>
        </div>
        <h4>Remaining budget: 
            <span v-if="remaining > 0" class="positive lg-font">
                <i class="nes-kirby"></i>
                {{ remaining | formatCurrency}}
            </span>
            <span v-else class="negative lg-font">
                <i class="nes-bulbasaur"></i>
                {{ remaining | formatCurrency}}
            </span>
        </h4>
    </div>
</template>

<script>
import numeral from 'numeral';
import { mapState } from 'vuex';


export default {
    created() {
        this.$store.dispatch('fetchBudget')
        this.$store.dispatch('fetchCurrentBudget')
        this.$store.dispatch('fetchExpenseCategory')
        this.$store.dispatch('fetchRemaining')
        
    },
    computed: {
        ...mapState(['current', 'budgets', 'expenseCategory', 'remaining'])
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

