<template>
  <div class="container">
    <div class="buttons is-right">
      <button
        @click="saveBudget"
        class="button is-outlined is-primary is-rounded"
      >
        Save budget
      </button>
    </div>
    <add-category></add-category>
    <div class="columns">
      <div class="field column is-one-fifth">
        <label class="label">Start Date</label>
        <div class="control is-large">
          <datepicker
            input-class="input"
            placeholder="mm/dd/yyyy"
            v-model="start"
          ></datepicker>
        </div>
      </div>
      <div class="field column is-one-fifth">
        <label class="label">End Date</label>
        <div class="control is-large">
          <datepicker
            input-class="input"
            placeholder="mm/dd/yyyy"
            v-model="end"
          ></datepicker>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical is-7">
        <article class="tile is-child notification is-primary">
          <p class="title">Input expenses</p>
          <div class="content columns">
            <table class="table" :data="mapExpenses">
              <thead>
                <th>Expense Name</th>
                <th>Expense Type</th>
                <th>Amount</th>
                <th>Date</th>
              </thead>
              <tbody>
                <tr v-for="(expense, index) in expByCat" :key="expense.id">
                  <td>{{ expense.name }}</td>
                  <td>
                    <div class="select">
                      <select v-model="expByCat[index].type">
                        <option disabled value>Select type</option>
                        <option>Credit</option>
                        <option>Loans</option>
                        <option>Housing</option>
                        <option>Transportation</option>
                        <option>Family</option>
                        <option>Insurance</option>
                        <option>Personal</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div class="control has-icons-left">
                      <input
                        class="input"
                        type="number"
                        step=".01"
                        v-model="expByCat[index].amount"
                      />
                      <span class="icon is-left is-medium">
                        <i class="fas fa-dollar-sign"></i>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="control">
                      <datepicker
                        input-class="input"
                        placeholder="mm/dd/yyyy"
                        v-model="expByCat[index].date"
                      ></datepicker>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child notification is-info height-30">
          <p class="title">Input income</p>
          <table class="table">
            <thead>
              <th>Income Source</th>
              <th>Income Amount</th>
            </thead>
            <tbody>
              <tr>
                <td>RoomRoster</td>
                <td>
                  <div class="control has-icons-left">
                    <input
                      class="input"
                      type="number"
                      step=".01"
                      v-model="income.rr.amount"
                    />
                    <span class="icon is-left is-medium">
                      <i class="fas fa-dollar-sign"></i>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Dyer Brown</td>
                <td>
                  <div class="control has-icons-left">
                    <input
                      class="input"
                      type="number"
                      step=".01"
                      v-model="income.db.amount"
                    />
                    <span class="icon is-left is-medium">
                      <i class="fas fa-dollar-sign"></i>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import { mapState } from 'vuex'
import numeral from 'numeral'
import AddCategory from './AddCategory.vue'

const fb = require('../firebaseConfig')

export default {
  created() {
    this.$store.dispatch('fetchBudgetItems')
    this.$store.dispatch('fetchBaseCategories')
  },
  components: {
    Datepicker,
    AddCategory
  },
  computed: {
    ...mapState(['currentBudget', 'budgetItem', 'budgetByItems', 'expensees']),
    mapExpenses() {
      let ex = this.$store.state.expensees
      let cats = this.expByCat

      ex.forEach(e => {
        cats.push({
          name: e,
          type: '',
          amount: '',
          date: ''
        })
      })
      return cats
    }
  },
  data() {
    return {
      budgetLine: {
        date: '',
        budgetType: '',
        expenseType: '',
        amount: '',
        name: ''
      },
      start: '',
      end: '',
      newItem: [],
      expByCat: [],
      income: {
        rr: {
          amount: ''
        },
        db: {
          amount: ''
        }
      },
      currCategories: null
    }
  },
  methods: {
    saveItem() {
      let item = this.budgetLine
      this.$store.dispatch('addBudgetItem', item)
    },
    saveBudget() {
      let expenses = this.expByCat
      let income = this.income
      let start = this.start
      let end = this.end
      let uid = this.$store.state.currentUser.uid
      let expenseArray = []

      for (var i = 0; i < expenses.length; i++) {
        expenseArray.push(Number(expenses[i].amount))
        fb.db
          .collection('BudgetedExpenses')
          .doc(uid)
          .collection('budgetExpenses')
          .add({
            date: moment(expenses[i].date).toISOString(),
            type: expenses[i].type,
            name: expenses[i].name,
            amount: Number(expenses[i].amount),
            spent: 0
          })
      }

      let expenseTotal = expenseArray.reduce((a, b) => a + b, 0)
      let incomeTotal = Number(income.rr.amount) + Number(income.db.amount)
      let difference = incomeTotal - Number(expenseTotal)

      fb.db
        .collection('BudgetOverview')
        .doc('Overview')
        .set({
          expenseTotal: Number(expenseTotal),
          incomeTotal: incomeTotal,
          start: start,
          end: end,
          difference: difference
        })
        .then(() => {
          this.$toasted.show('Budget created successfully', {
            theme: 'toasted-primary',
            position: 'top-center',
            duration: 5000
          })
        })
    },
    clearData() {
      let state = this.budgetLine
      ;(state.amount = ''),
        (state.name = ''),
        (state.budgetType = ''),
        (state.expenseType = '')
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
