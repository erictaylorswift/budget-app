<template>
  <v-calendar :attributes="attributes">
    <div class="expenses-row" slot-scope="{customData}" slot="expense-row">
      <div class="expenses-content">
        <p>{{customData.name != '' ? customData.name : customData.expenseType}} | {{customData.amount | formatCurrency}}</p>
      </div>
    </div>
    <!-- <div class="totals-row" slot-scope="{totalData}" slot="total-row">
      <div>
        <p>{{ totalData.expenseTotal }}</p>
      </div>
    </div> -->
  </v-calendar>
</template>

<script>
  import { mapState } from "vuex";
  import numeral from "numeral";
  import moment from "moment";
  export default {
    created() {
      this.$store.dispatch("fetchBudgetItems");
    },
    computed: {
      ...mapState(["budgetByItems", "budgetDates", "expensesByDay"]),
      attributes() {
        let items = this.$store.state.budgetByItems;
        return [
          ...items.map(res => ({
            dates: res.date,
            bar: {
              backgroundColor: "#ff8080"
            },
            customData: res,
            popover: {
              slot: "expense-row",
              visibility: "hover"
            }
          }))
        ];
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
