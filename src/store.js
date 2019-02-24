/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import { fireSQL } from './firebaseConfig';
import moment from 'moment'

const fb = require('./firebaseConfig')

fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
    }
});

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        currentUser: null,
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
                'child Care': 0,
            }
        },
        income: 0,
        dailyExpenses: [],
        expenseCategory: [],
        expTotal: 0,
        current: [],
        remaining: [],
        showExpenseModal: false
    },
    actions: {
        fetchExpenseTotals({ commit }) {
            const promise = fireSQL.query(`
                SELECT 
                    category,
                    SUM(budgeted) as value,
                    SUM(spent) as spent
                FROM ExpenseCategories
                GROUP BY category
            `)

            promise.then(query => {
                let calc = 0;
                query.forEach(doc => {
                    if (doc.category != 'bills' && doc.category != 'income') {
                        calc = calc + Number(doc.spent)
                    }
                })

                return calc
            }).then((data) => {
                commit('setExpTotal', data)
            })
        },
        fetchIncome({ commit }) {
            let income = 0
            let budgetDates = []
            
            const budgetPromise = fireSQL.query(`
                SELECT
                    start,
                    end
                FROM Budget
            `)
            
            budgetPromise.then(query => {
                budgetDates.push({
                    'start': (query[0].start),
                    'end': (query[0].end)
                }) 
            })


            const incomePromise = fireSQL.query(`
                SELECT
                    date,
                    SUM(income) as value
                FROM Income
                GROUP BY date
            `)

            incomePromise.then(query => {
                query.forEach(doc => {
                    let incDate = moment(doc.date)
                    let start = moment(budgetDates[0].start)
                    let end = moment(budgetDates[0].end)
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
                
                expenseDataset.sort((a,b) => {
                    return new Date(a.date) - new Date(b.date)
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
        fetchCurrentBudget({ commit }) {
            fb.budgetCollection.onSnapshot(querySnapshot => {
                let budgetArray = [];

                querySnapshot.forEach(doc => {
                    let budget = doc.data();                  

                    budgetArray.push(budget)
                })

                let current = budgetArray[0];
                let typesArray = Object.keys(current);
                let amountsArray = Object.values(current);
                let currentArray = [];
    
                for (var i = 0; i<typesArray.length; i++) {
                    let types = typesArray[i];
                    let amounts = amountsArray[i]

                    if (
                        types != 'start' && 
                        types != 'end'
                    ) {
                        currentArray.push({
                            'type': types.toLocaleLowerCase(),
                            'amount': amounts
                        })
                    }
                }

                commit('setCurrentBudget', currentArray)
            })
        },
        fetchExpenseCategory({ commit }) {
            let categorySet = [];

            const categoryPromise = fireSQL.query(`
                SELECT
                    category,
                    spent,
                    budgeted
                FROM ExpenseCategories
            `)

            categoryPromise.then(query => {
                query.forEach(doc => {
                    let budgeted = Number(doc.budgeted);
                    let spent = Number(doc.spent);
                    let remaining = budgeted - spent;
                    categorySet.push({
                        'type': doc.category.toLocaleLowerCase(),
                        'budgeted': budgeted,
                        'spent': spent,
                        'remaining': remaining
                    })
                })

                commit('setExpenseCategory', categorySet)
            })
        },
        fetchRemaining({ commit }) {

            const promise = fireSQL.query(`
                SELECT 
                    category,
                    SUM(budgeted) as value,
                    SUM(spent) as spent
                FROM ExpenseCategories
                GROUP BY category
            `)

            promise.then(query => {
                let calc = 0;
                let total = 0;

                query.forEach(doc => {
                    if (doc.category != 'bills' && doc.category != 'income') {
                        calc = calc + (doc.value - doc.spent)
                        total = total + doc.value
                    }
                })

                let remainingPercent = (calc / total)*100
                let remainingObj = {
                    remaining: calc,
                    budgeted: total,
                    percent: remainingPercent
                }
                return remainingObj
            }).then((data) => {
                commit('setRemaining', data)
            })

            
        }
    },
    mutations: {
        setBudget(state, val) {
            state.budgets = val
        },
        setCurrentBudget(state, val) {
            state.current = val
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
        },
        setRemaining(state, val) {
            state.remaining = val
        },
        setCurrentUser(state, val) {
            state.currentUser = val
        },
    }
})