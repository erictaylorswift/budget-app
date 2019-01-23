<template>
    <div id="budget">
        <modal name="budget-modal" height="auto">
            <div id="modal">
                <form @submit.prevent>
                    <label>Budgeted expenses</label>
                    <input v-model="budget.expenses">
                    <label>Budgeted income</label>
                    <input v-model="budget.income">
                    <button @click="saveBudget">Submit</button>
                </form>
            </div>
        </modal>
        <div>
            <button @click="newBudget" class="nes-btn is-primary new-budget-button">New budget</button>
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
            this.$modal.show('budget-modal')
            this.createdBudget = true
        }
    }
    
}
</script>

