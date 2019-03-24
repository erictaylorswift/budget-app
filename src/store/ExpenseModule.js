import { fireSQL } from '../firebaseConfig'
import moment from 'moment'

const fb = require('../firebaseConfig')

const expenseModule = {
  state: {
    expenses: [],
    dailyExpenses: [],
    expenseCat: [],
    expTotal: 0,
    expensesByDay: []
  },
  actions: {
    fetchExpensesByDay({ commit }) {
      let data = []
      let totals = []
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
              expenseTotal: Number(doc.totals),
              date: doc.date
            })
            totals.push(Number(doc.totals))
          }
        })
      })

      commit('setExpensesByDay', data)
    },
    fetchExpenseTotals({ commit, rootState }) {
      let uid = rootState.currentUser.uid
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
        .collection('ExpenseTotals')
        .doc(uid)
        .collection('Totals')
        .onSnapshot(querySnapshot => {
          let calc = 0
          let start = moment(dates[0].start).toISOString()
          let end = moment(dates[0].end).toISOString()

          querySnapshot.forEach(doc => {
            let data = doc.data()
            let date = moment(data.date).toISOString()
            let startDiff = moment(date).diff(moment(start), 'days')
            let endDiff = moment(date).diff(moment(end), 'days')
            if (startDiff >= 0 && endDiff < 0) {
              calc = calc + Number(data.value)
            }
          })
          console.log(calc)
          commit('setExpTotal', calc)
        })
    },
    fetchExpenses({ commit, rootState }) {
      let uid = rootState.currentUser.uid
      let dates = []
      let expenseArray = []
      let categoryArray = []

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
        .collection('Expenses')
        .doc(uid)
        .collection('Expenses')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            let start = moment(dates[0].start)
            let end = moment(dates[0].end)
            let data = doc.data()
            let date = moment(data.date)
            let startDiff = date.diff(start, 'days')
            let endDiff = date.diff(end, 'days')

            if (startDiff >= 0 && endDiff <= -1) {
              expenseArray.push({
                date: date.toISOString(),
                type: data.expense,
                note: data.note,
                amount: Number(data.value)
              })
            }
            commit('setExpenses', expenseArray)
          })
        })
      fb.db
        .collection('ExpenseTotals')
        .doc(uid)
        .collection('Totals')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            let start = moment(dates[0].start)
            let end = moment(dates[0].end)
            let data = doc.data()
            let date = moment(data.date)
            let startDiff = date.diff(start, 'days')
            let endDiff = date.diff(end, 'days')

            if (startDiff >= 0 && endDiff <= -1) {
              categoryArray.push({
                category: data.category,
                amount: Number(data.value)
              })
            }
            commit('setExpenseCategories', categoryArray)
          })
        })
    }
  },
  mutations: {
    setExpensesByDay(state, val) {
      state.expensesByDay = val
    },
    setExpenses(state, val) {
      state.expenses = val
    },
    setDailyExpenses(state, val) {
      state.dailyExpenses = val
    },
    setExpTotal(state, val) {
      state.expTotal = val
    },
    setExpenseCategories(state, val) {
      state.expenseCat = val
    }
  }
}

export default expenseModule
