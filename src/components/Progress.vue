<template>
  <v-card class="mt-5 ml-3">
    <v-sheet class="mx-auto pa-3" color="green lighten-1">
      <div class="text-xs-center">
        <v-progress-circular :value="0" :size="100" color="white"
          >{{ percentRemaining }}%</v-progress-circular
        >
      </div>
    </v-sheet>
    <v-card-text>
      <div class="title font-weight-bold mb-2">Percent remaining in budget</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import numeral from 'numeral'
import moment from 'moment'
export default {
  created() {
    this.$store.dispatch('fetchExpenses')
    this.$store.dispatch('fetchBudgetTotals')
  },
  data() {
    return {}
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
