<template>
  <div v-if="showExpenseModal">
    <v-card class="px-5 py-5">
      <v-card-title>
        <span class="headline">Add new expense</span>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm6 md4>
            <v-select
              v-model="expense.label"
              :items="categories"
              label="Select type"
              @change="getSources()"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-select
              v-model="expense.note"
              :items="this.sources"
              label="Select expense source"
              class="ml-5"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field
              label="Add amount"
              type="number"
              step=".01"
              v-model="expense.value"
              class="ml-5"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field
              v-model="expense.date"
              label="Expense date"
              readonly
              @click="showPicker"
              prepend-inner-icon="event"
            ></v-text-field>
            <v-dialog v-model="menu" width="600px">
              <v-date-picker
                v-model="expense.date"
                @input="menu = false"
                :landscape="true"
                full-width
                header-color="purple accent-4"
              ></v-date-picker>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab medium color="success" @click="saveExpense">
          <v-icon>check</v-icon>
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="snackbar" color="pink darken-3">
        Please add an expense amount
        <v-btn color="pink lighten-5" :flat="true" @click="snackbar = false"
          >close</v-btn
        >
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
const fb = require('../../firebaseConfig')

export default {
  data() {
    return {
      expense: {
        label: '',
        category: '',
        value: null,
        note: '',
        date: moment().format('YYYY-MM-DD')
      },
      menu: false,
      snackbar: false,
      sources: []
    }
  },
  computed: {
    ...mapState(['Expenses', 'showExpenseModal', 'Budgets']),
    ...mapGetters(['categories'])
  },
  methods: {
    saveExpense() {
      let timestamp = moment(this.expense.date).format('MM-DD-YY')
      let expenseLabel = this.expense.label
      let expenseValue = this.expense.value
      let billCategory = this.expense.category
      let expenseNote = this.expense.note
      let uid = this.$store.state.currentUser.uid

      if (this.expense.value != null && this.expense.value != '') {
        fb.db
          .collection('Expenses')
          .doc(uid)
          .collection('Expenses')
          .add({
            expense: expenseLabel,
            category: billCategory,
            value: expenseValue,
            note: expenseNote,
            date: timestamp
          })
          .catch(err => alert(err))

        fb.db
          .collection('ExpenseTotals')
          .doc(uid)
          .collection('Totals')
          .add({
            date: timestamp,
            category: expenseLabel,
            value: expenseValue
          })
          .then(() => {
            expenseLabel = ''
            this.expense.category = ''
            this.expense.value = null
            this.expense.note = ''
            this.expense.date = ''
          })
          .then(() => {
            this.$store.dispatch('fetchExpenseTotals')
          })

        fb.db
          .collection('BudgetedExpenses')
          .doc(uid)
          .collection('budgetExpenses')
          .where('name', '==', expenseNote)
          .get()
          .then(res => {
            let doc = res.docs[0].id
            fb.db
              .collection('BudgetedExpenses')
              .doc(uid)
              .collection('budgetExpenses')
              .doc(doc)
              .get()
              .then(d => {
                let data = d.data()
                let oldSpent = data.spent

                fb.db
                  .collection('BudgetedExpenses')
                  .doc(uid)
                  .collection('budgetExpenses')
                  .doc(d.id)
                  .update({
                    spent: Number(oldSpent) + Number(expenseValue)
                  })
              })
          })
      } else {
        this.snackbar = true
      }
    },
    closeModal() {
      this.$store.state.showExpenseModal = false
    },
    showPicker() {
      this.menu = !this.menu
    },
    getSources() {
      let category = this.expense.label
      let data = this.$store.state.Budgets.baseTypes[category]

      this.sources = data
    }
  },
  created() {
    this.$store.dispatch('fetchExpenseTotals')
    this.$store.dispatch('fetchBaseCategories')
  }
}
</script>
