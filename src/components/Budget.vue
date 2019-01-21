<template>
    <div>
        <form @submit.prevent v-if="createdBudget">
            <label>Budgeted expenses</label>
            <input v-model="budget.expenses">
            <label>Budgeted income</label>
            <input v-model="budget.income">
            <button @click="saveBudget">Submit</button>
        </form>
        <div v-if="!createdBudget">
            <button @click="newBudget">New budget</button>
        </div>
    </div>
</template>

<script>
import { firestore } from 'firebase';
const fb = require('../firebaseConfig')

export default {
    data() {
        return {
            budget: {
                expenses: null,
                income: null
            },
            createdBudget: false
        }
    },
    methods: {
        saveBudget() {
            fb.db.collection('Budget').doc('Budgets').set({
                'expenses': this.budget.expenses,
                'income': this.budget.income
            }).catch(err => console.log(err))

            this.createdBudget = false
        },
        newBudget() {
            this.createdBudget = true
        }
    }
    
}
</script>

