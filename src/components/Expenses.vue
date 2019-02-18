<template>
    <div class="flex">
        <modal 
            name="expense-modal"
            height='auto'>
            <div id="modal">
                <form @submit.prevent>
                    <div class="flex-column">
                        <label>Select Expense</label>
                        <select v-model.trim="expense.label">
                            <option disabled value="">Expense</option>
                            <option>Groceries</option>
                            <option>Bills</option>
                            <option>Allowances</option>
                            <option>Savings</option>
                            <option>Child Care</option>
                            <option>Prescriptions</option>
                            <option>Rent</option>
                        </select>
                    </div>
                    <div class="flex-column" v-if="expense.label == 'Bills'">
                        <label>Select Expense</label>
                        <select v-model.trim="expense.category">
                            <option disabled value="">category</option>
                            <option>Credit</option>
                            <option>Loans</option>
                            <option>Hydro</option>
                            <option>Car</option>
                            <option>Cell phone</option>
                            <option>Internet</option>
                            <option>Insurance</option>
                            <option>Subscriptions</option>
                            <option>Gym</option>
                        </select>
                    </div>
                    <label>Add an expensee</label>
                    <input v-model="expense.note" placeholder="expensee">
                    <label>Add amount</label>
                    <input type="number" v-model.trim="expense.value" placeholder="amount">
                    <label> Select expense date</label>
                    <datepicker
                        wrapper-class="date-wrapper"
                        placeholder="expense date"
                        v-model="expense.date">
                    </datepicker>
                    <button @click="saveExpense" class="budget-btn">Submit</button>
                </form>
            </div>
        </modal>
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
            let timestamp = moment(this.expense.date).format('MM-DD-YY')
            let expenseLabel = this.expense.label
            let expenseValue = this.expense.value
            let billCategory = this.expense.category
            let expenseNote = this.expense.note
        
            fb.db.collection("Expenses").add({
                'expense': expenseLabel,
                'category': billCategory,
                'value': expenseValue,
                'note': expenseNote,
                'date': timestamp
            }).catch(err => alert(err))


            fb.db.collection('ExpenseTotals').add({
                'date': timestamp,
                'category': expenseLabel,
                'value': expenseValue
            }).then(() => {
                this.expense.label = '',
                this.expense.category = '',
                this.expense.value = null,
                this.expense.note = '',
                this.expense.date = ''
            }).then(() => {
                this.$store.dispatch('fetchExpenseTotals')
            })

            if (billCategory == "") {
                fb.db.collection('ExpenseCategories').doc(expenseLabel.toLowerCase()).get().then(res => {
                    let data = res.data();

                    fb.db.collection('ExpenseCategories').doc(expenseLabel.toLowerCase()).update({
                        'spent': Number(data.spent) + Number(expenseValue)
                    })
                })
            } else {
                fb.db.collection('ExpenseCategories').doc(billCategory.toLowerCase()).get().then(res => {
                    let data = res.data();


                    fb.db.collection('ExpenseCategories').doc(billCategory.toLowerCase()).update({
                        'spent': Number(data.spent) + Number(expenseValue)
                    })
                })
            }

            

            this.$modal.hide('expense-modal')
        },
    },
    created() {
        this.$store.dispatch('fetchExpenseTotals')
    }    
}
</script>

