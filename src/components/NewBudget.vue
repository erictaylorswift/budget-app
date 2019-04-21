<template>
  <div class="container">
    <v-layout row wrap>
      <v-flex d-flex xs12 class="mt-0 mb-4">
        <v-card>
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
                  prepend-inner-icon="event"
                  readonly
                  v-on="on"
                ></v-combobox>
              </template>
              <v-date-picker v-model="budgetDates" multiple no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn :flat="true" color="red accent-3" @click="menu = false"
                  >Close</v-btn
                >
                <v-btn
                  :flat="true"
                  color="primary"
                  @click="$refs.menu.save(budgetDates)"
                  >Save</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 class="mb-4">
        <v-card>
          <v-card-text>
            <span class="headline">Input incomes</span>
            <v-layout>
              <v-flex
                v-for="(income, index) in Budgets.incomeSources"
                :key="income.name"
                xs2
              >
                <v-text-field
                  v-model="incomes[index].amount"
                  :hint="'add income amount for ' + incomes[index].name"
                  :persistent-hint="true"
                  class="mr-3"
                  prefix="$"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-layout row wrap>
          <span class="headline mb-4">Add expenses</span>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs3 v-for="(category, name, i) in budgetLine" :key="name">
                <v-card class="mb-2 mr-2 pb-3 elevation-10">
                  <v-toolbar :color="colors[i]" dark>
                    <v-toolbar-title>
                      {{ name }}
                    </v-toolbar-title>
                  </v-toolbar>
                  <div v-for="(type, typeName) in category" :key="typeName">
                    <v-divider></v-divider>
                    <v-layout class="px-3" align-center>
                      <v-flex>
                        <span
                          class="text-truncate mt-3 font-weight-bold grey--text text--darken-2"
                          >{{ typeName }}</span
                        >
                        <v-layout wrap row justify-start="" class="mb-3">
                          <v-flex class="mr-3" xs3>
                            <v-text-field
                              type="number"
                              step=".01"
                              prefix="$"
                              :persistent-hint="true"
                              hint="Amount to budget"
                              v-model="budgetLine[name][typeName].amount"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-menu
                              v-model="budgetLine[name][typeName].dateSelector"
                              :close-on-content-click="false"
                            >
                              <template slot="activator" :slot-scope="{ on }">
                                <v-text-field
                                  v-model="budgetLine[name][typeName].date"
                                  :v-on="on"
                                  hint="Select date"
                                  :persistent-hint="true"
                                  prepend-inner-icon="event"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="budgetLine[name][typeName].date"
                                @input="
                                  budgetLine[name][
                                    typeName
                                  ].dateSelector = false
                                "
                                :max="budgetDates[1]"
                                :min="budgetDates[0]"
                              >
                              </v-date-picker>
                            </v-menu>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
            <v-btn fab fixed dark color="pink" right bottom @click="saveBudget"
              ><v-icon>check</v-icon></v-btn
            >
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
    ...mapGetters(['categories', 'expenseTypes', 'incomeTypes'])
  },
  data() {
    return {
      menu: false,
      dialog: false,
      budgetLine: this.$store.getters.expenseTypes,
      budgetDates: [],
      expByCat: [],
      editedItem: {
        category: '',
        name: '',
        date: moment().format('MM Do, YYYY'),
        amount: 0
      },
      lineItem: {},
      amount: [],
      mask: '##/##/####',
      colors: [
        'purple darken-2',
        'green darken-2',
        'pink accent-3',
        'teal darken-2',
        'amber darken-3',
        'deep-orange accent-3',
        'light-green darken-4',
        'cyan darken-4'
      ],
      max: '',
      on: false,
      incomes: this.$store.getters.incomeTypes
    }
  },
  methods: {
    saveItem() {
      let item = this.budgetLine
      this.$store.dispatch('addBudgetItem', item)
    },
    saveBudget() {
      let expenses = this.budgetLine
      let incs = this.incomes
      let start = this.budgetDates[0]
      let end = this.budgetDates[1]
      let uid = this.$store.state.currentUser.uid
      let expenseArray = []
      let incomeArray = []

      _.forIn(expenses, (value, key) => {
        _.forIn(value, (v, k) => {
          expenseArray.push(Number(v.amount))
          fb.db
            .collection('BudgetedExpenses')
            .doc(uid)
            .collection('budgetExpenses')
            .add({
              date: moment(v.date).toISOString(),
              type: key,
              name: v.name,
              spent: 0,
              amount: v.amount
            })
        })
      })

      _.forIn(incs, (value, key) => {
        if (value.amount != null) {
          incomeArray.push(Number(value.amount))
        }
      })
      let incomeTotal = incomeArray.reduce((a, b) => a + b, 0)
      let expenseTotal = expenseArray.reduce((a, b) => a + b, 0)

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
    },
    saveNew() {
      let expenses = this.budgetLine

      _.forIn(expenses, (value, key) => {
        _.forIn(value, (v, k) => {
          console.log({
            name: v.name,
            amount: v.amount,
            date: moment(v.date).toISOString(),
            spent: 0,
            type: key
          })
        })
      })
    },
    getMax() {
      if (this.budgetDates[1] != '') {
        this.max = moment(this.budgetDates[1]).toISOString()
      }
    }
  },
  watch: {
    budgetDates: val => {
      this.max = moment(val[1]).toISOString()
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
