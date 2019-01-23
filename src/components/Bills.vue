<template>
    <div class="nes-table-responsive">
        <table class="nes-table is-bordered">
            <thead>
                <tr>
                    <th>Bill</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="bill in bills" :key="bill.id">
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
const fb = require('../firebaseConfig')

export default {
    created() {
        this.$store.dispatch('fetchBills')
    },
    computed: {
        ...mapState(['bills'])
    }
}
</script>

