/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import { fireSQL } from '../firebaseConfig'
import moment from 'moment'
import ExpenseModule from './ExpenseModule'
import BudgetModule from './budgets'

const fb = require('../firebaseConfig')

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
  }
})

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    Expenses: ExpenseModule,
    Budgets: BudgetModule
  },
  state: {
    currentUser: null,
    percent: 0,
    incTotal: 0,
    incomes: [],
    current: [],
    bottomSheet: false,
    showExpenseModal: false,
    showIncomeModal: false,
    showNewNameModal: false,
    showNewCatModal: false,
    showNewIncSourceModal: false,
    drawer: null,
    performingRequest: false
  },
  actions: {
    fetchUser({ commit }) {
      let user = fb.auth.currentUser

      if (user != null) {
        commit('setCurrentUser', user)
      }
    },
    fetchIncomes({ commit, state }) {
      let uid = state.currentUser.uid
      let dates = []
      fb.db
        .collection('Overview')
        .doc(uid)
        .get()
        .then(doc => {
          let data = doc.data()
          dates.push({
            start: data.start,
            end: data.end
          })
        })

      fb.db
        .collection('Income')
        .doc(uid)
        .collection('income')
        .onSnapshot(querySnapshot => {
          let incomeArray = []
          let calc = 0

          querySnapshot.forEach(doc => {
            let data = doc.data()

            let date = moment(data.date)
            let start = moment(dates[0].start)
            let end = moment(dates[0].end)
            let startDiff = date.diff(start, 'days')
            let endDiff = date.diff(end, 'days')

            if (startDiff >= 0 && endDiff <= -1) {
              incomeArray.push({
                type: data.type,
                amount: Number(data.income)
              })

              calc = calc + Number(data.income)
            }

            commit('setIncTotal', calc)
            commit('setIncomes', incomeArray)
          })
        })
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setStart(state, val) {
      state.budgetStart = val
    },
    setEnd(state, val) {
      state.budgetEnd = val
    },
    setIncTotal(state, val) {
      state.incTotal = val
    },
    setIncomes(state, val) {
      state.incomes = val
    },
    setPercentRemaining(state, val) {
      state.percent = val
    }
  }
})
