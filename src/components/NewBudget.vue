<template>
  <div class="container">
    <div class="buttons is-right">
      <button @click="saveBudget" class="button is-outlined is-primary is-rounded">Save budget</button>
    </div>
    <badger-accordion :icons="this.accordion.icons">
      <badger-accordion-item>
        <div slot="header">
          Add expense category
        </div>
        <template slot="content">
          <div class="columns">
            <div class="control column">
              <input class="input" v-model="newCategory">
            </div>
            <div class="buttons column is-right">
              <button class="button is-rounded" @click="addCategory">Add category</button>
            </div>
          </div>
        </template>
      </badger-accordion-item>
    </badger-accordion>
    <div class="columns">
      <div class="field column is-one-fifth">
        <label class="label">Start Date</label>
        <div class="control is-large">
          <datepicker input-class="input" placeholder="mm/dd/yyyy" v-model="start"></datepicker>
        </div>
      </div>
      <div class="field column is-one-fifth">
        <label class="label">Start Date</label>
        <div class="control is-large">
          <datepicker input-class="input" placeholder="mm/dd/yyyy" v-model="end"></datepicker>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical is-7">
        <article class="tile is-child notification is-primary">
          <p class="title">Input expenses</p>
          <div class="content columns">
            <table class="table">
              <thead>
                <th>Expense Name</th>
                <th>Expense Type</th>
                <th>Amount</th>
                <th>Date</th>
              </thead>
              <tbody>
                <tr v-for="(expense, index) in expenses" :key="expense.id">
                  <td>{{expense.name}}</td>
                  <td>
                    <div class="select">
                      <select v-model="expenses[index].type">
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
                        v-model="expenses[index].amount"
                      >
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
                        v-model="expenses[index].date"
                      
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
                    <input class="input" type="number" step=".01" v-model="income.rr.amount">
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
                    <input class="input" type="number" step=".01" v-model="income.db.amount">
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
  import Datepicker from "vuejs-datepicker";
  import moment from "moment";
  import { mapState } from "vuex";
  import numeral from "numeral";

  const fb = require("../firebaseConfig");

  export default {
    created() {
      this.$store.dispatch("fetchBudgetItems");
      this.mapExpenses();
    },
    components: {
      Datepicker
    },
    computed: {
      ...mapState(["currentBudget", "budgetItem", "budgetByItems"])
    },
    data() {
      return {
        budgetLine: {
          date: "",
          budgetType: "",
          expenseType: "",
          amount: "",
          name: ""
        },
        start: "",
        end: "",
        newItem: [],
        newCategory: '',
        expensees: [
          "MBNA",
          "PC MasterCard",
          "ScotiaBank Visa",
          "Capital One",
          "London Y",
          "India Taylor",
          "Leah Taylor",
          "Mogo",
          "Rent",
          "Child Care",
          "Fido",
          "Bell",
          "Hyundai",
          "Volkswagen",
          "Gas",
          "Insurance",
          "Allowances",
          "Utilities",
          "Prescriptions"
        ],
        expenses: [],
        income: {
          rr: {
            amount: ""
          },
          db: {
            amount: ""
          }
        },
        accordion: {
          icons: {
            closed: '<i class="fas fa-arrow-down"></i>',
            opened: '<i class="fas fa-arrow-up"></i>'
          },
          options: {
            panelClass: 'accordion-header'
          }
        },
        currCategories: null
      };
    },
    methods: {
      saveItem() {
        let item = this.budgetLine;
        this.$store.dispatch("addBudgetItem", item);
      },
      saveBudget() {
        let expenses = this.expenses;
        let income = this.income
        let start = this.start;
        let end = this.end;
        let expenseArray = [];

        for (var i = 0; i < expenses.length; i++) {
          expenseArray.push(Number(expenses.amount));
          fb.db.collection("BudgetedExpenses").add({
            date: moment(expenses[i].date).toISOString(),
            type: expenses[i].type,
            name: expenses[i].name,
            amount: Number(expenses[i].amount),
            spent: 0
          });
        }

        let expenseTotal = expenseArray.reduce((a, b) => a + b, 0);
        let incomeTotal = Number(income.rr.amount) + Number(income.db.amount);
        let difference = incomeTotal - expenseTotal;

        fb.db
          .collection("BudgetOverview")
          .doc("Overview")
          .set({
            expenseTotal: expenseTotal,
            incomeTotal: incomeTotal,
            start: start,
            end: end,
            difference: difference
          });
      },
      clearData() {
        let state = this.budgetLine;
        (state.amount = ""),
          (state.name = ""),
          (state.budgetType = ""),
          (state.expenseType = "");
      },
      mapExpenses() {
        let expensees = this.expensees;

        expensees.forEach(e => {
          this.expenses.push({
            name: e,
            type: "",
            amount: "",
            date: ""
          });
        });
      },
      addCategory() {
        let category = this.newCategory;
        let currentUser = this.$store.state.currentUser.uid;
        let currCategories = {categories: []};

        let docRef = fb.db.collection('ExpenseCategories').doc(currentUser)

        docRef.get()
          .then((doc) => {
            let categories = doc.data().categories;
            
            categories.forEach(d => {
              currCategories.categories.push(d)
            })
          }).then(() => {
            currCategories.categories.push(category);
          }).then(() => {
            docRef.set(currCategories)
          }).then(() => {
            this.newCategory = '';
          })
      }
    },
    filters: {
      formatDate(val) {
        let date = moment(val).format("MMM Do, YYYY");
        return date;
      },
      formatCurrency(val) {
        let value = numeral(val).format("$0,0");
        return value;
      }
    }
  };
</script>

