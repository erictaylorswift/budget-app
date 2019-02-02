<template>
    <div class="flex">
        <modal name="income-modal">
            <input type="number" v-model="income.value" placeholder="enter amount">
            <datepicker
                wrapper-class="date-wrapper"
                placeholder="select income date"
                v-model="income.date">
            </datepicker>
            <button @click="saveIncome">Submit</button>
        </modal>
    </div>
</template>

<script>
import moment from 'moment';
import Datepicker from 'vuejs-datepicker'
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
                alert(err)
            })
        }
    },
}
</script>

