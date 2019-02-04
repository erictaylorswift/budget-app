/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import { fireSQL } from './firebaseConfig';
import moment from 'moment'

const fb = require('./firebaseConfig')

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        budgets: {},
        expenses: {},
        currentBudget: {
            start: 0,
            end: 0,
            expenses: {
                rent: 0,
                credit: 0,
                loans: 0,
                utilities: 0,
                phones: 0,
                car: 0,
                internet: 0,
                insurance: 0,
                subscriptions: 0,
                gym: 0,
                groceries: 0,
                allowances: 0,
                savings: 0,
                childCare: 0,
            }
        },
        income: 0,
        dailyExpenses: [],
        expenseCategory: [],
        expTotal: 0
    },
    actions: {
        fetchExpenseTotals({ commit }) {
            let total = 0

            const promise = fireSQL.query(`
                SELECT
                    date,
                    SUM(value) as value
                FROM ExpenseTotals

                GROUP BY date
            `)

            promise.then(query => {

                query.forEach(doc => {
                    let expDate = moment(doc.date)
                    let start = moment(this.state.budgets[0].start)
                    let end = moment(this.state.budgets[0].end)
                    let startDiff = expDate.diff(start, "days")
                    let endDiff = expDate.diff(end, "days")

                    if (startDiff > -1 && endDiff < 1) {
                        total = doc.value + total   
                    }
                })
                commit('setExpTotal', total)
            }).catch(err => {
                alert(err)
            })
        },
        fetchIncome({ commit }) {
            let income = 0

            const promise = fireSQL.query(`
                SELECT
                    SUM(income) as value
                FROM Income
            `)

            promise.then(query => {
                query.forEach(doc => {
                    let incDate = moment(doc.date)
                    let start = moment(this.state.budgets[0].start)
                    let end = moment(this.state.budgets[0].end)
                    let startDiff = incDate.diff(start, "days")
                    let endDiff = incDate.diff(end, "days")

                    if ( startDiff > -1 && endDiff < 1 ) {
                        income = doc.value + income
                    }
                })
                commit('setIncome', income)
            })
        },
        fetchExpenses({ commit }) {
            fb.expenseCollection.orderBy("date", "asc").orderBy("expense").onSnapshot(querySnapshot => {
                let expenseArray = [];

                querySnapshot.forEach(doc => {
                    let expenses = doc.data();
                    let date = moment(expenses.date).format('MM-DD-YYYY');
                    let category = expenses.category;
                    let type = expenses.expense;
                    let note = expenses.note;
                    let amount = expenses.value;

                    expenseArray.push({
                        date: date,
                        category: category,
                        type: type,
                        note: note,
                        amount: amount
                    })
                })

                commit('setExpenses', expenseArray)
            })
        },
        fetchDailyExpenses({ commit }) {
            const expenseDataset = [];

            const expensePromise = fireSQL.query(`
                SELECT
                    date,
                    SUM(value) as value
                FROM Expenses

                GROUP BY date
            `)
            
            expensePromise.then(query => {
                query.forEach(doc => {
                    expenseDataset.push({
                        'date': doc.date,
                        'amount': Number(doc.value)
                    })
                })
                commit('setDailyExpenses', expenseDataset)
            })
        },
        fetchBudget({ commit }) {
            fb.budgetCollection.onSnapshot(querySnapshot => {
                let budgetArray = [];

                querySnapshot.forEach(doc => {
                    let budget = doc.data();

                    budgetArray.push(budget)
                })

                commit('setBudget', budgetArray)
            })
        },
        fetchExpenseCategory({ commit }) {
            let categorySet = [];

            const categoryPromise = fireSQL.query(`
                SELECT
                    category,
                    SUM(value) as totalValue
                FROM ExpenseTotals

                GROUP BY category
            `)

            categoryPromise.then(query => {
                query.forEach(doc => {
                    categorySet.push({
                        'category': doc.category,
                        'amount': doc.totalValue
                    })
                })

                commit('setExpenseCategory', categorySet)
            })
        },
    },
    mutations: {
        setBudget(state, val) {
            state.budgets = val
        },
        setDailyExpenses(state, val) {
            state.dailyExpenses = val
        },
        setExpenseCategory(state, val) {
            state.expenseCategory = val
        },
        setExpTotal(state, val) {
            state.expTotal = val
        },
        setIncome(state, val) {
            state.income = val
        },
        setExpenses(state, val) {
            state.expenses = val
        }
    }
})