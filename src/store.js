/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'

const fb = require('./firebaseConfig')

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        expenses: {},
        budgets: [],
        incomes: {}
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
        },
        fetchIncome({ commit }) {
            fb.incomeCollection.onSnapshot(querySnapshot => {
                let incomeArray = []

                querySnapshot.forEach(doc => {
                    let income = doc.data()
                    incomeArray.push(Number(income.income))
                })

                let incomeTotal = incomeArray.reduce((a,b) => a + b )
                commit('setIncome', incomeTotal)
            })
        }
    },
    mutations: {
        setExpenses(state, val) {
            state.expenses = val
        },
        setBudget(state, val) {
            state.budgets = val
        },
        setIncome(state, val) {
            state.incomes = val
        }
    }
})