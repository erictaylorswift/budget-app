import { fireSQL } from '../firebaseConfig'
import moment from 'moment'
import _ from 'lodash'

const fb = require('../firebaseConfig')

const budgets = {
  state: {
    budgetItem: [],
    budgetByItems: [],
    budgetTotals: [],
    expensees: [],
    baseTypes: [],
    incomeSources: [],
    budgetStart: '',
    budgetEnd: '',
    budgetedExpenses: null
  },
  getters: {
    budgetDates: state => {
      return {
        start: state.budgetTotals[0].start,
        end: state.budgetTotals[0].end
      }
    },
    expenses: state => {
      return state.budgetTotals[0].expenses
    },
    categories: state => {
      return Object.keys(state.baseTypes)
    },
    expenseTypes: state => {
      return _.mapValues(state.baseTypes, (cats) => {
            return  _.chain(cats).map((types) => {
                return {
                  name: types,
                  amount: 0,
                  date: null
                }
              }).keyBy("name").value()
      })
    }
  },
  actions: {
    addBudgetItem({ commit }, json) {
      commit('setBudgetItem', json)
    },
    fetchBaseCategories({ commit, rootState }) {
      let userID = rootState.currentUser.uid
      let cat = []

      fb.db
        .collection('ExpenseCategories')
        .doc(userID)
        .get()
        .then(doc => {
          let array = doc.data().categories

          array.forEach(i => {
            cat.push(i)
          })
        })

      commit('setBaseCat', cat)
    },
    fetchBaseTypes({ commit, rootState }) {
      let userID = rootState.currentUser.uid

      fb.db
        .collection('ExpenseTypes')
        .doc(userID)
        .get()
        .then(doc => {
          let array = doc.data()
          return array
        })
        .then(arr => {
          commit('setBaseTypes', arr)
        })
    },
    fetchIncomeSources({ commit, rootState }) {
      let userID = rootState.currentUser.uid
      let sources = []

      fb.db
        .collection('IncomeSources')
        .doc(userID)
        .get()
        .then(doc => {
          let array = doc.data().source

          array.forEach(i => {
            sources.push(i)
          })
        })

      commit('setIncomeSources', sources)
    },
    fetchBudgetItems({ commit, rootState }) {
      let uid = rootState.currentUser.uid
      let budgetItems = []

      fb.db
        .collection('BudgetedExpenses')
        .doc(uid)
        .collection('budgetExpenses')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            let data = doc.data()
            let budgeted = Number(data.amount)
            let spent = Number(data.spent)

            budgetItems.push({
              amount: budgeted,
              date: data.date,
              name: data.name,
              spent: spent,
              type: data.type,
              remaining: Number(budgeted - spent)
            })
          })
          commit('setBudgetByItems', budgetItems)
        })
    },
    fetchBudgetTotals({ commit, rootState }) {
      let uid = rootState.currentUser.uid
      let totals = []
      fb.db
        .collection('Overview')
        .doc(uid)
        .get()
        .then(doc => {
          let data = doc.data()
          totals.push({
            income: data.incomeTotal,
            expenses: data.expenseTotal,
            difference: data.difference,
            start: data.start,
            end: data.end
          })
        })
      commit('setBudgetTotals', totals)
    }
  },
  mutations: {
    setExpenseCategories(state, val) {
      state.expenseCat = val
    },
    setBudgetItem(state, val) {
      state.budgetItem.push({
        ...val
      })
    },
    setBudgetByItems(state, val) {
      state.budgetByItems = val
    },
    setBudgetTotals(state, val) {
      state.budgetTotals = val
    },
    setBaseCat(state, val) {
      state.expensees = val
    },
    setBaseTypes(state, val) {
      state.baseTypes = val
    },
    setIncomeSources(state, val) {
      state.incomeSources = val
    },
    setBudgetExpenses(state, val) {
      state.budgetedExpenses = val
    }
  }
}

export default budgets
