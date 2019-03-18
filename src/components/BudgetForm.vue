<template>
  <div>
    <form @submit.prevent>
      <label>Budget dates</label>
      <div class="flex">
        <datepicker
          v-model="currentBudget.start"
          input-class="date-input"
          wrapper-class="date-wrapper"
          placeholder="select start date"
        ></datepicker>
        <datepicker
          v-model="currentBudget.end"
          input-class="date-input"
          wrapper-class="date-wrapper"
          placeholder="select end date"
        ></datepicker>
      </div>
      <div class="flex">
        <div class="flex-column one-third" id="bills">
          <label>Credit</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.credit"
          />
          <label>Loans</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.loans"
          />
          <label>Utilities</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.utilities"
          />
          <label>Cell Phones</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.phones"
          />
          <label>Car</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.car"
          />
          <label>Internet</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.internet"
          />
          <label>Insurance</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.insurance"
          />
          <label>Subscriptions</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.subscriptions"
          />
          <label>Gym</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.gym"
          />
        </div>
        <div class="flex-column one-third" id="otherExpenses">
          <label>Rent</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.rent"
          />
          <label>Groceries</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.groceries"
          />
          <label>Allowances</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.allowances"
          />
          <label>Savings</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.savings"
          />
          <label>Child Care</label>
          <input
            step=".01"
            type="number"
            v-model="currentBudget.expenses.childCare"
          />
        </div>
        <div class="flex-column one-third" id="income">
          <label>Budgeted income</label>
          <input v-model="currentBudget.income" />
        </div>
      </div>
      <button @click="saveBudget" class="nes-btn is-success">Submit</button>
    </form>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import { mapState } from 'vuex'
import numeral from 'numeral'
const fb = require('../firebaseConfig')

export default {
  components: {
    Datepicker
  },
  computed: {
    ...mapState(['currentBudget'])
  },
  data() {
    return {}
  },
  methods: {
    saveBudget() {
      let budget = this.$store.state.currentBudget
      let bills = budget.expenses
      let billsObj = Object.values(bills)
      let expenseKeys = Object.keys(bills)

      let billsArray = []

      for (var i = 0; i < billsObj.length; i++) {
        billsArray.push(Number(billsObj[i]))
      }
      let billsTotal = billsArray.reduce((a, b) => a + b, 0)

      fb.db
        .collection('Budget')
        .doc('Budgets')
        .set({
          start: moment(budget.start).toISOString(),
          end: moment(budget.end).toISOString(),
          income: Number(budget.income),
          expenses: {
            groceries: Number(budget.expenses.groceries),
            allowances: Number(budget.expenses.allowances),
            savings: Number(budget.expenses.savings),
            'child Care': Number(budget.expenses.childCare),
            credit: Number(budget.expenses.credit),
            loans: Number(budget.expenses.loans),
            utilities: Number(budget.expenses.utilities),
            cellphone: Number(budget.expenses.phones),
            car: Number(budget.expenses.car)
          },
          bills: billsTotal
        })

      for (var c = 0; c < billsObj.length; c++) {
        fb.db
          .collection('ExpenseCategories')
          .doc(expenseKeys[c])
          .set({
            category: expenseKeys[c],
            budgeted: Number(billsObj[c]),
            spent: 0
          })
      }
    },
    goHome() {
      this.$router.push('/')
    }
  },
  filters: {
    formatDate(val) {
      let date = moment(val).format('MMM Do, YYYY')
      return date
    },
    formatCurrency(val) {
      let value = numeral(val).format('$0,0')
      return value
    }
  }
}
</script>
