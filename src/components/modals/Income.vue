<template>
  <div class="modal is-active" v-if="showIncomeModal">
    <div class="modal-background"></div>
    <div class="modal-card" id="modal">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new income</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field columns">
          <div class="control column is-half">
            <label class="label">Add income</label>
            <div class="control has-icons-left">
              <input
                class="input"
                type="number"
                step=".01"
                v-model="income.value"
                placeholder="enter amount"
              />
              <span class="icon is-left is-medium">
                <i class="fas fa-dollar-sign"></i>
              </span>
            </div>
          </div>
          <div class="control column is-half">
            <label class="label">Income type</label>
            <div class="control">
              <input
                class="input"
                v-model="income.note"
                placeholder="where did you make money?"
              />
            </div>
          </div>
        </div>
        <div class="field columns">
          <div class="field column is-half">
            <label class="label">Start Date</label>
            <div class="control is-large">
              <datepicker
                input-class="input"
                placeholder="mm/dd/yyyy"
                v-model="income.date"
                typeable="true"
              ></datepicker>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success is-rounded" @click="saveIncome">
          Submit
        </button>
      </footer>
    </div>
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
        date: null,
        note: null
      }
    }
  },
  methods: {
    closeModal() {
      this.$store.state.showIncomeModal = false
      this.$store.dispatch('fetchIncomes')
    },
    saveIncome() {
      let timestamp = moment(this.income.date).format('MM-DD-YY')
      let uid = this.$store.state.currentUser.uid
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
          this.income.value = null
          this.income.note = null
        })
        .catch(err => {
          alert(err)
        })
    }
  },
  computed: {
    ...mapState(['showIncomeModal'])
  }
}
</script>
