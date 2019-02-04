<template>
    <div class="flex">
        <modal name="income-modal">
            <div class="flex-column">
                <label>
                    Income Amount
                </label>
                <input 
                    type="number" 
                    v-model="income.value" 
                    placeholder="enter amount"
                >
                <label>
                    Income Type
                </label>
                <input 
                    v-model="income.note" 
                    placeholder="where did you make money?"
                >
                <label>
                    Date
                </label>
                <datepicker
                    wrapper-class="date-wrapper"
                    placeholder="select income date"
                    v-model="income.date">
                </datepicker>
            </div>
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
                date: null,
                note: null
            }
        }
    },
    methods: {
        saveIncome() {
            let timestamp = moment(this.income.date).format('MM-DD-YY')

            fb.db.collection("Income").add({
                'type': 'Income',
                'date': timestamp,
                'income': this.income.value
            }).then(() => {
                this.income.value = null
                this.income.value = null
                this.income.note = null
            }).catch(err => {
                alert(err)
            })

            this.$modal.hide('income-modal')
        }
    },
}
</script>

