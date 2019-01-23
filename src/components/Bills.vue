<template>
    <div class="nes-table-responsive">
        <table class="nes-table is-bordered">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Bill</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="bill in bills" :key="bill.id">
                    <td>
                        {{ bill.date | formatDate }}
                    </td>
                    <td>
                        {{ bill.bill }} 
                    </td>
                    <td>
                        ${{ bill.amount }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { firestore } from 'firebase';
import store from '../store'
const fb = require('../firebaseConfig')

export default {
    created() {
        this.$store.dispatch('fetchBills')
        this.datediff = moment(store.bills[0].date) - moment(store.budgets[0].start)
    },
    computed: {
        ...mapState(['bills', 'budgets'])
    },
    data() {
        return {
            datediff: 0
        }
    },
    filters: {
        formatDate(val) {
            let date = moment(val).format('MMM Do, YYYY')
            return date
        }
    }
}
</script>

