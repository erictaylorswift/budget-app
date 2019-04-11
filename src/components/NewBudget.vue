<template>
  <div class="container">
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md4 lg4 xl4>
        <v-card>
          <v-card-title>
            <span class="title">Select budget period</span>
          </v-card-title>
          <v-card-text>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="budgetDates"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template slot="activator" :slot-scope="{ on }">
                <v-combobox
                  v-model="budgetDates"
                  multiple
                  chips
                  small-chips
                  label="Budget period"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-combobox>
              </template>
              <v-date-picker v-model="budgetDates" multiple no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="red accent-3" @click="menu = false"
                  >Close</v-btn
                >
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.menu.save(budgetDates)"
                  >Save</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12 lg12>
        <v-toolbar color="white" class="mt-3 mb-1">
          <v-toolbar-title>Add expense items</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template slot="activator" :slot-scope="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">New expense item</span>
              </v-card-title>
              <v-card-text>
                <v-container gird-list-md>
                  <v-layout wrap>
                    <v-flex class="mx-1">
                      <v-select
                        v-model="editedItem.category"
                        :items="categories"
                        label="Select expense category"
                        @change="getSources()"
                      ></v-select>
                    </v-flex>
                    <v-flex class="mx-1">
                      <v-select
                        v-model="editedItem.name"
                        :items="sources"
                        label="Select expense source"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </v-flex>
      <v-flex>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card
              v-for="(name, i) in mapExpenses"
              :key="name"
              class="mb-2 mr-2 elevation-10"
            >
              <v-card-title
                ><h2 class="headline">
                  {{ Object.keys(name)[0] }}
                </h2></v-card-title
              >
              <div v-for="(item, index) in name[Object.keys(name)]" :key="item">
                <v-layout class="px-3">
                  <v-text-field :value="item" disabled class="pr-3">
                  </v-text-field>
                  <v-spacer></v-spacer>
                  <v-flex>
                    <v-layout>
                      <v-flex>
                        <v-text-field
                          type="number"
                          step=".01"
                          prefix="$"
                          label="Amount to budget"
                          @change="newItem(item)"
                          v-model="amount[i]"
                        ></v-text-field>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex>
                        <v-text-field></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
import numeral from 'numeral'
import AddCategory from './AddCategory.vue'
import _ from 'lodash'

const fb = require('../firebaseConfig')

export default {
  created() {
    this.$store.dispatch('fetchBudgetItems')
    this.$store.dispatch('fetchBaseCategories')
  },
  computed: {
    ...mapState(['Expenses', 'Budgets']),
    ...mapGetters(['categories']),
    mapExpenses() {
      let ex = this.$store.getters.categories
      let types = this.$store.state.Budgets.baseTypes
      let arr = []
      let typeArr = []
      let count = 0
      ex.forEach(t => {
        arr.push({
          [t]: types[t]
        })
        count = count + 1
      })

      return arr
    }
  },
  data() {
    return {
      menu: false,
      dialog: false,
      budgetLine: {
        date: '',
        budgetType: '',
        expenseType: '',
        amount: '',
        name: ''
      },
      budgetDates: [],
      expByCat: [],
      editedItem: {
        category: '',
        name: '',
        date: moment().format('MM Do, YYYY'),
        amount: 0
      },
      lineItem: {},
      amount: []
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
        .collection('Overview')
        .doc(uid)
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
    },
    getSources() {
      let category = this.editedItem.category
      let data = this.$store.state.Budgets.baseTypes[category]

      this.sources = data
    },
    newItem(name, val) {
      this.lineItem = {
        name: name,
        value: val
      }
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
