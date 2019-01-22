<template>
    <div>
        <form @submit.prevent>
            <input type="number" v-model="income.value">
            <button @click="saveIncome">Submit</button>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { firestore } from 'firebase';
const fb = require('../firebaseConfig')

export default {
    data() {
        return {
            income: {
                value: null,
            }
        }
    },
    methods: {
        saveIncome() {
            let timestamp = moment().toISOString()

            fb.db.collection('Income').add({
                'date': timestamp,
                'income': this.income.value
            }).then(() => {
                this.income.value = null
            }).catch(err => {
                console.log(err)
            })
        }
    },
}
</script>

