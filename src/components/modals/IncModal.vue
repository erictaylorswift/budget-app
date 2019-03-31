<template>
  <div>
    <v-bottom-sheet v-model="showIncomeModal" persistent="true">
      <v-toolbar flat="true" dark color="purple accent-4">
        <v-btn icon dark @click="closeModal">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card class="px-5 py-5">
        <v-card-title>
          <span class="headline">Add new income</span>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Add income"
                type="number"
                step=".01"
                v-model="income.value"
                placeholder="Add income amount"
                prefix="$"
                class="mr-5"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Income type"
                v-model="income.note"
                prepend-inner-icon="category"
                placeholder="where did you make your money?"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                v-model="income.date"
                label="Income date"
                readonly
                @click="showPicker"
                prepend-inner-icon="event"
                class="ml-5"
              ></v-text-field>
              <v-dialog v-model="menu" width="600px">
                <v-date-picker
                  v-model="income.date"
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
          <v-btn fab medium color="success" @click="saveIncome">
            <v-icon @click="saveIncome">check</v-icon>
          </v-btn>
        </v-card-actions>
        <v-snackbar v-model="snackbar" color="pink darken-3">
          Please add an income amount
          <v-btn color="pink lighten-5" flat @click="snackbar = false"
            >close</v-btn
          >
        </v-snackbar>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig')

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      income: {
        value: null,
        date: moment().format('YYYY-MM-DD'),
        note: null
      },
      menu: false,
      today: moment().format('YYYY-MM-DD'),
      snackbar: false
    }
  },
  methods: {
    closeModal() {
      this.$store.state.showIncomeModal = false
      this.$store.dispatch('fetchIncomes')
    },
    showPicker() {
      this.menu = !this.menu
    },
    saveIncome() {
      let timestamp = moment(this.income.date).format('MM-DD-YY')
      let uid = this.$store.state.currentUser.uid
      if (this.income.value != null && this.income.value != '') {
        fb.db
          .collection('Income')
          .doc(uid)
          .collection('income')
          .add({
            type: 'Income',
            date: timestamp,
            income: this.income.value
          })
          .then(() => {
            this.income.value = null
            this.income.date = this.today
            this.income.note = null
          })
          .catch(err => {
            alert(err)
          })
      } else {
        this.snackbar = true
      }
    }
  },
  computed: {
    ...mapState(['showIncomeModal'])
  }
}
</script>
