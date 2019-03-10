/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import {
    fireSQL
} from './firebaseConfig';
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
        expenses: {},
        dailyExpenses: [],
        expenseCat: [],
        expTotal: 0,
        incTotal: 0,
        current: [],
        showExpenseModal: false,
        showIncomeModal: false,
        showNewNameModal: false,
        budgetItem: [],
        budgetByItems: [],
        budgetDates: [],
        expensesByDay: [],
        budgetTotals: [],
        expensees: [
        ],
        baseTypes: [],
        incomeSources: []
    },
    actions: {
        addBudgetItem({
            commit
        }, json) {
            commit('setBudgetItem', json)
        },
        fetchBaseCategories({commit, state}) {
            let userID = state.currentUser.uid;
            let cat = [];

            fb.db.collection('ExpenseCategories')
            .doc(userID)
            .get()
            .then((doc) => {
                let array = doc.data().categories;

                array.forEach(i => {
                    cat.push(i)
                })
            })

            commit('setBaseCat', cat)
        },
        fetchBaseTypes({commit, state}) {
            let userID = state.currentUser.uid;
            let types = [];

            fb.db.collection('ExpenseTypes')
            .doc(userID)
            .get()
            .then((doc) => {
                let array = doc.data().types

                array.forEach(i => {
                    types.push(i)
                })
            })

            commit('setBaseTypes', types)
        },
        fetchIncomeSources({commit, state}) {
            let userID = state.currentUser.uid;
            let sources = [];

            fb.db.collection('IncomeSources')
            .doc(userID)
            .get()
            .then((doc) => {
                let array = doc.data().source

                array.forEach(i => {
                    sources.push(i)
                })
            })

            commit('setIncomeSources', sources)
        },
        fetchExpensesByDay({
            commit
        }) {
            let data = [];
            let totals = [];
            const promise = fireSQL.query(`
                SELECT
                    SUM(amount) as totals,
                    date
                FROM BudgetedExpenses
                GROUP BY date
            `)

            promise.then(query => {
                query.forEach(doc => {
                    if (doc.date != null) {
                        data.push({
                            'expenseTotal': Number(doc.totals),
                            'date': doc.date
                        })
                        totals.push(Number(doc.totals))
                    }
                })
            })

            commit('setExpensesByDay', data)
        },
        fetchBudgetDates({
            commit
        }) {
            let dates = [];
            const datePromise = fireSQL.query(`
                SELECT
                    start,
                    end
                FROM BudgetOverview
            `)

            datePromise.then(query => {
                dates.push({
                    'start': moment(query[0].start).toISOString(),
                    'end': moment(query[0].end).toISOString()

                })
            })
            commit('setBudgetDates', dates)
        },
        fetchBudgetItems({
            commit
        }) {
            let budgetItems = [];
            const promise = fireSQL.query(`
                SELECT
                    amount,
                    type,
                    name,
                    spent,
                    date
                FROM BudgetedExpenses
            `)

            promise.then(query => {
                query.forEach(doc => {
                    if (doc.date != null) {
                        budgetItems.push({
                            amount: doc.amount,
                            expenseType: doc.type,
                            name: doc.name,
                            spent: doc.spent,
                            date: moment(doc.date).toISOString()
                        })
                    }
                })
            })
            commit('setBudgetByItems', budgetItems)
        },
        fetchBudgetTotals({
            commit
        }) {
            let totals = [];
            const promise = fireSQL.query(`
                SELECT
                    expenseTotal,
                    incomeTotal,
                    difference
                FROM BudgetOverview
            `)

            promise.then(query => {
                totals.push({
                    'income': query[0].incomeTotal,
                    'expenses': query[0].expenseTotal,
                    'difference': query[0].difference
                })
            })
            commit('setBudgetTotals', totals)
        },
        fetchExpenseTotals({
            commit
        }) {

            const datePromise = fireSQL.query(`
                SELECT
                    start,
                    end
                FROM BudgetOverview
            `)
            let dates = [];
            datePromise.then(query => {
                dates.push({
                    "start": query[0].start,
                    "end": query[0].end
                })
            })
            const promise = fireSQL.query(`
                SELECT 
                    date,
                    SUM(value) as value
                FROM ExpenseTotals
                GROUP BY date
            `)
            promise.then(query => {
                let calc = 0;
                let start = dates[0].start;
                let end = dates[0].end;
                query.forEach(doc => {
                    let date = moment(doc.date).toISOString();
                    if (date > start && date < end) {
                        calc = calc + Number(doc.value)
                    }
                })

                return calc
            }).then((data) => {
                commit('setExpTotal', data)
            })
        },
        fetchExpenseCategories({commit}) {
            const datePromise = fireSQL.query(`
                SELECT
                    start,
                    end
                FROM BudgetOverview
            `)
            let dates = [];
            datePromise.then(query => {
                dates.push({
                    "start": query[0].start,
                    "end": query[0].end
                })
            })
            let expenses = [];

            const promise = fireSQL.query(`
                SELECT
                    category,
                    date,
                    value
                FROM ExpenseTotals
            `)

            promise.then(query => {
                query.forEach(doc => {
                    let date = moment(doc.date).toISOString();
                    let start = dates[0].start;
                    let end = dates[0].end;
                    if (date > start && date < end) {
                        expenses.push({
                            'category': doc.category,
                            'amount': doc.value
                        })
                    }
                })
            })

            commit('setExpenseCategories', expenses)

        },
        fetchExpenses({
            commit
        }) {
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
        fetchDailyExpenses({
            commit
        }) {
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

                expenseDataset.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date)
                })

                commit('setDailyExpenses', expenseDataset)
            })
        },
        fetchIncomes({commit}) {
            const datePromise = fireSQL.query(`
                SELECT
                    start,
                    end
                FROM BudgetOverview
            `)
            let dates = [];
            datePromise.then(query => {
                dates.push({
                    "start": query[0].start,
                    "end": query[0].end
                })
            })

            const promise = fireSQL.query(`
                SELECT
                    date,
                    SUM(income) as income
                FROM Income
                GROUP BY date
            `)

            promise.then(query => {
                let total = 0;
                let start = dates[0].start;
                let end = dates[0].end;
                query.forEach(doc => {
                    let date = moment(doc.date).toISOString();
                    if (date > start && date < end) {
                        total = total + Number(doc.income)
                    }
                })
                return total
            }).then((data) => {
                commit('setIncTotal', data)
            })
        }
    },
    mutations: {
        setDailyExpenses(state, val) {
            state.dailyExpenses = val
        },
        setExpTotal(state, val) {
            state.expTotal = val
        },
        setExpenses(state, val) {
            state.expenses = val
        },
        setExpenseCategories(state, val) {
            state.expenseCat = val
        },
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setBudgetItem(state, val) {
            state.budgetItem.push({
                ...val
            })
        },
        setBudgetByItems(state, val) {
            state.budgetByItems = val
        },
        setBudgetDates(state, val) {
            state.budgetDates = val
        },
        setExpensesByDay(state, val) {
            state.expensesByDay = val
        },
        setBudgetTotals(state, val) {
            state.budgetTotals = val
        },
        setIncTotal(state, val) {
            state.incTotal = val
        },
        setBaseCat(state, val) {
            state.expensees = val
        },
        setBaseTypes(state, val) {
            state.baseTypes = val
        },
        setIncomeSources(state, val) {
            state.incomeSources = val
        }
    }
})