<template>
  <div class="tile is-ancestor is-10">
    <div class="tile is-vertical">
      <h1 class="title">Expenses by day</h1>
      <div class="tile is-child box">
        <div class="tile is-parent is-vertical">
          <div class="tile is-child">
            <div class="columns">
              <div class="column is-one-third">
                <h2 class="subtitle">Expense types by day</h2>
                <Calendar></Calendar>
              </div>
              <div class="column">
                <ExpensesByDay/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import moment from "moment";
  import numeral from "numeral";
  import ExpensesByDay from "./charts/ExpensesByDay";
  import Calendar from "./Calendar";

  export default {
    components: {
      ExpensesByDay,
      Calendar
    },
    mounted() {
      this.$store.dispatch("fetchBudgetItems");
      this.$store.dispatch("fetchExpensesByDay");
      this.$store.dispatch("fetchBudgetDates");
    },
    computed: {
      ...mapState(["budgetByItems", "budgetDates", "expensesByDay"]),
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
