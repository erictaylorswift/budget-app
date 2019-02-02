/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

const fb = require('./firebaseConfig')

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        expenses: null,
        budgets: {},
        incomes: null,
        bills: [],
        expectedExpenses: null,
        allowances: [],
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
            },
            income: 0

        }
    },
    actions: {
        fetchBudget({ commit }) {
            fb.budgetCollection.onSnapshot(querySnapshot => {
                let budgetArray = [];
                let expectedExp = null;

                querySnapshot.forEach(doc => {
                    let budget = doc.data();

                    let budgetedExpense = budget.expenses;
                    let start = moment(budget.start);
                    let timeFromStart = moment().diff(start, 'days');
                    let end = moment(budget.end);
                    let days = end.diff(start, 'days');
                    expectedExp = (budgetedExpense / days)*timeFromStart;


                    budgetArray.push(budget)
                })

                commit('setBudget', budgetArray)
                commit('setBudgetExp', expectedExp)
            })
        },
        fetchExpenses({ commit }) {
            fb.expenseCollection.onSnapshot(querySnapshot => {
                let expenseArray = []

                querySnapshot.forEach(doc => {
                    let expense = doc.data()

                    expenseArray.push({
                        'amount': Number(expense.value),
                        'date': expense.date
                    })
                })

                commit('setExpenses', expenseArray)
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
        },
        fetchBills({ commit }) {
            fb.billsCollection.orderBy("date", "asc").onSnapshot(querySnapshot => {
                let billsArray = []

                querySnapshot.forEach(doc => {
                    let bill = doc.data()
                    let billName = bill.category
                    let billNote = bill.note
                    let billValue = Number(bill.value)
                    let billDate = moment(bill.date).toISOString()

                    billsArray.push({
                        'bill': billName,
                        'expensee': billNote,
                        'amount': billValue,
                        'date': billDate
                   })

                commit('setBills', billsArray)
                })
            })
        },
        fetchAllowances({ commit }) {
            fb.allowanceCollection.orderBy("date", "asc").onSnapshot(querySnapshot => {
                let allowanceArray = [];

                querySnapshot.forEach(doc => {
                    let allowance = doc.data()

                    allowanceArray.push({
                        'allowance': allowance.note,
                        'amount': Number(allowance.value),
                        'date': allowance.date
                    })
                })

                commit('setAllowance', allowanceArray)
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
        },
        setBills(state, val) {
            state.bills = val
        },
        setBudgetExp(state, val) {
            state.expectedExpenses = val
        },
        setOverUnder(state, val) {
            state.overUnder = val
        },
        setAllowance(state, val) {
            state.allowances = val
        }
    }
})