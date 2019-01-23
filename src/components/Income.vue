<template>
    <div class="flex no-wrap">
        <input type="number" v-model="income.value" placeholder="enter amount">
        <datepicker
            wrapper-class="date-wrapper"
            placeholder="select income date"
            v-model="income.date">
        </datepicker>
        <button @click="saveIncome">Submit</button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker'
import { firestore } from 'firebase';
const fb = require('../firebaseConfig')

export default {
    components: {
        Datepicker
    },
    data() {
        return {
            income: {
                value: null,
                date: null
            }
        }
    },
    methods: {
        saveIncome() {
            let timestamp = moment(this.income.date).format('MMM Do, YYYY')

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

