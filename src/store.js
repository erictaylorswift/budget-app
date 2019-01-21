/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'

const fb = require('./firebaseConfig')

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        expenses: {},
        income: {},
        budgets: []
    },
    actions: {
        fetchExpenses({ commit }) {
            fb.expenseCollection.onSnapshot(querySnapshot => {
                let expenseArray = []

                querySnapshot.forEach(doc => {
                    let expense = doc.data()
                    expenseArray.push(Number(expense.value))
                })

                let total = expenseArray.reduce((a,b) => a + b)
                commit('setExpenses', total)
            })
        },
        fetchBudget({ commit }) {
            fb.budgetCollection.onSnapshot(querySnapshot => {
                let budgetArray = []

                querySnapshot.forEach(doc => {
                    let budget = doc.data()
                    budgetArray.push(budget)
                })

                commit('setBudget', budgetArray)
            })
        }
    },
    mutations: {
        setExpenses(state, val) {
            state.expenses = val
        },
        setBudget(state, val) {
            state.budgets = val
        }
    }
})