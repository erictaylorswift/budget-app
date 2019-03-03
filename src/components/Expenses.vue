<template>
  <div class="modal is-active" v-if="showExpenseModal">
    <div class="modal-background"></div>
    <div id="modal" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add new expense</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field columns">
          <div class="control column">
            <label class="label">Select Type</label>
            <div class="select">
              <select v-model.trim="expense.label">
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
          </div>
          <div class="control column">
            <label class="label">Select expense source</label>
            <div class="select">
              <select v-model="expense.note">
                <option v-for="option in expensees" :key="option.id">{{ option }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field columns">
          <div class="field column">
            <div class="field-label">
              <label class="label has-text-left">Add amount</label>
            </div>
            <div class="field-body">
              <input class="input" type="number" v-model.trim="expense.value" placeholder="amount">
            </div>
          </div>
          <div class="field column">
            <div class="field-label">
              <label class="label has-text-left">Select expense date</label>
            </div>
            <div class="field-body">
              <datepicker input-class="input" placeholder="expense date" v-model="expense.date"></datepicker>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="saveExpense" class="button is-success is-rounded">Submit</button>
      </footer>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import moment from "moment";
  import Datepicker from "vuejs-datepicker";
  const fb = require("../firebaseConfig");

  export default {
    data() {
      return {
        expense: {
          label: "",
          category: "",
          value: null,
          note: "",
          date: null
        }
      };
    },
    components: { Datepicker },
    computed: {
      ...mapState(["expenses", "showExpenseModal", "expensees"])
    },
    methods: {
      saveExpense() {
        let timestamp = moment(this.expense.date).format("MM-DD-YY");
        let expenseLabel = this.expense.label;
        let expenseValue = this.expense.value;
        let billCategory = this.expense.category;
        let expenseNote = this.expense.note;

        fb.db
          .collection("Expenses")
          .add({
            expense: expenseLabel,
            category: billCategory,
            value: expenseValue,
            note: expenseNote,
            date: timestamp
          })
          .catch(err => alert(err));

        fb.db
          .collection("ExpenseTotals")
          .add({
            date: timestamp,
            category: expenseLabel,
            value: expenseValue
          })
          .then(() => {
            (this.expense.label = ""),
              (this.expense.category = ""),
              (this.expense.value = null),
              (this.expense.note = ""),
              (this.expense.date = "");
          })
          .then(() => {
            this.$store.dispatch("fetchExpenseTotals");
          });

        fb.db
          .collection("BudgetedExpenses")
          .where("name", "==", expenseNote)
          .get()
          .then(res => {
            let doc = res.docs[0].id
            fb.db
              .collection("BudgetedExpenses")
              .doc(doc)
              .get()
              .then(d => {
                  let data = d.data()
                  let oldSpent = data.spent
                  
                  fb.db
                  .collection("BudgetedExpenses")
                  .doc(d.id)
                  .update({
                      spent: Number(oldSpent) + Number(expenseValue)
                  })
              });
          });
        this.$modal.hide("expense-modal");
      },
      closeModal() {
        this.$store.state.showExpenseModal = false;
      }
    },
    created() {
      this.$store.dispatch("fetchExpenseTotals");
    }
  };
</script>

