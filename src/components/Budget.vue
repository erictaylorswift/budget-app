<template>
    <div id="budget">
        <modal name="budget-modal">
            <div id="modal">
                <form @submit.prevent>
                    <label>Budget dates</label>
                    <div class="flex">
                        <datepicker
                            v-model="budget.dates.start" 
                            input-class="date-input"
                            wrapper-class="date-wrapper"
                            placeholder="select start date">
                        </datepicker>
                        <datepicker
                            v-model="budget.dates.end"
                            input-class="date-input"
                            wrapper-class="date-wrapper"
                            placeholder="select end date">
                        </datepicker>
                    </div>
                    <label>Budgeted expenses</label>
                    <input v-model="budget.expenses">
                    <label>Budgeted income</label>
                    <input v-model="budget.income">
                    <button @click="saveBudget" class="budget-btn">Submit</button>
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
import Datepicker from 'vuejs-datepicker';
import moment from 'moment'
const fb = require('../firebaseConfig')

export default {
    components: {
        Datepicker
    },
    data() {
        return {
            budget: {
                expenses: null,
                income: null,
                dates: {
                    start: null,
                    end: null,
                }
            },
            createdBudget: false
        }
    },
    methods: {
        saveBudget() {
            fb.db.collection('Budget').doc('Budgets').set({
                'expenses': this.budget.expenses,
                'income': this.budget.income,
                'start': moment(this.budget.dates.start).format('MMM Do, YYYY'),
                'end': moment(this.budget.dates.end).format('MMM Do, YYYY')
            }).catch(err => console.log(err))

            this.createdBudget = false
            this.$modal.hide('budget-modal')
            this.$toasted.show("Budget updated", {
                position: 'top-center',
                duration: 1000,
                fullWidth: true,
                fitToScreen: true,
                type: 'success'
            })
        },
        newBudget() {
            this.$modal.show('budget-modal')
            this.createdBudget = true
        }
    }
    
}
</script>

