<template>
    <div class="flex">
        <select v-model.trim="expense.label" class="expense-selection">
            <option disabled value="">Select an expense</option>
            <option>Groceries</option>
            <option>Bills</option>
            <option>Allowances</option>
            <option>Savings</option>
            <option>Child Care</option>
        </select>
        <select v-if="expense.label == 'Bills'" v-model.trim="expense.category">
            <option disabled value="">category</option>
            <option>Credit</option>
            <option>Loan</option>
            <option>Hydro</option>
            <option>Car</option>
            <option>Cell phone</option>
            <option>Internet</option>
            <option>Insurance</option>
            <option>Subscriptions</option>
            <option>Gym</option>
        </select>
        <input v-model="expense.note" placeholder="expensee" class="expense-input">
        <input type="number" v-model.trim="expense.value" placeholder="amount" class="expense-input">
        <datepicker
            wrapper-class="date-wrapper"
            placeholder="expense date"
            v-model="expense.date">
        </datepicker>
        <button @click="saveExpense">Submit</button>
    </div>
    
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker'
const fb = require('../firebaseConfig')


export default {
    data(){
        return {
            expense: {
                label: '',
                category: '',
                value: null,
                note: '',
                date: null
            }
        }
    },
    components: { Datepicker },
    computed: {
        ...mapState(['expenses'])
    },
    methods: {
        saveExpense() {
            let timestamp = moment(this.expense.date).toISOString()
            let expenseLabel = this.expense.label
            let expenseValue = this.expense.value
            let billCategory = this.expense.category
            let expenseNote = this.expense.note
        
            fb.db.collection(expenseLabel).add({
                'date': timestamp,
                'category': billCategory,
                'value': expenseValue,
                'note': expenseNote
            }).catch(err => alert(err))

            fb.db.collection('Expenses').add({
                'date': timestamp,
                'category': expenseLabel,
                'value': expenseValue
            }).then(() => {
                this.expense.label = '',
                this.expense.category = '',
                this.expense.value = null,
                this.expense.note = '',
                this.expense.date = ''
            })
        },
    },
    created() {
        this.$store.dispatch('fetchExpenses')
    }    
}
</script>

