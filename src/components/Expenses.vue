<template>
    <div>
        <form @submit.prevent>
            <select v-model.trim="expense.label">
                <option disabled value="">Select an expense</option>
                <option>Groceries</option>
                <option>Bills</option>
                <option>Allowances</option>
                <option>Savings</option>
            </select>
            <select v-if="expense.label == 'Bills'" v-model.trim="expense.category">
                <option disabled value="">Select a category</option>
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
            <input v-model="expense.note" placeholder="enter expensee">
            <input type="number" v-model.trim="expense.value" placeholder="enter amount">
            <button @click="saveExpense">Submit</button>
        </form>
    </div>
    
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { firestore } from 'firebase';
const fb = require('../firebaseConfig')


export default {
    data(){
        return {
            expense: {
                label: '',
                category: '',
                value: null,
                note: ''
            }
        }
    },
    computed: {
        ...mapState(['expenses'])
    },
    methods: {
        saveExpense() {
            let timestamp = moment().toISOString()
            let expenseLabel = this.expense.label
            let expenseValue = this.expense.value
            let billCategory = this.expense.category
            let expenseNote = this.expense.note
        
            fb.db.collection(expenseLabel).add({
                'date': timestamp,
                'category': billCategory,
                'value': expenseValue,
                'note': expenseNote
            }).catch(err => console.log(err))

            fb.db.collection('Expenses').add({
                'date': timestamp,
                'category': expenseLabel,
                'value': expenseValue
            }).then(() => {
                this.expense.label = '',
                this.expense.category = '',
                this.expense.value = null,
                this.expense.note = ''
            })
        },
    },
    created() {
        this.$store.dispatch('fetchExpenses')
    }    
}
</script>

