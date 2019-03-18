import { fireSQL } from '../firebaseConfig'
import moment from 'moment'

const fb = require('../firebaseConfig')

const budgets = {
  state: {
    budgetItem: [],
    budgetByItems: [],
    budgetTotals: [],
    expensees: [],
    baseTypes: [],
    incomeSources: []
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
      let types = []

      fb.db
        .collection('ExpenseTypes')
        .doc(userID)
        .get()
        .then(doc => {
          let array = doc.data().types

          array.forEach(i => {
            types.push(i)
          })
        })

      commit('setBaseTypes', types)
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
    fetchBudgetItems({ commit }) {
      let budgetItems = []

      commit('setBudgetByItems', budgetItems)
    },
    fetchBudgetTotals({ commit }) {
      let totals = []
      const promise = fireSQL.query(`
                  SELECT
                      expenseTotal,
                      incomeTotal,
                      difference
                  FROM BudgetOverview
              `)

      promise.then(query => {
        totals.push({
          income: query[0].incomeTotal,
          expenses: query[0].expenseTotal,
          difference: query[0].difference
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
    }
  }
}

export default budgets
