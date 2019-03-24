<template>
  <v-calendar
    :attributes="attributes"
    :theme-styles="styles"
    title-position="left"
  >
    <span slot="header-title" slot-scope="{ shortMonthLabel, shortYearLabel }"
      >Budget dates | {{ shortMonthLabel }} - {{ shortYearLabel }}</span
    >
    <div class="expenses-row" slot-scope="{ customData }" slot="expense-row">
      <div class="expenses-content">
        <p>
          {{ customData.name != '' ? customData.name : customData.expenseType }}
          | {{ customData.amount | formatCurrency }}
        </p>
      </div>
    </div>
  </v-calendar>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'
import moment from 'moment'
export default {
  data() {
    return {
      styles: {
        wrapper: {
          background: '#fff',
          border: '0',
          borderRadius: '5px',
          boxShadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
        },
        dayCellNotInMonth: {
          opacity: 0
        },
        headerArrows: {
          display: 'none'
        }
      }
    }
  },
  created() {
    this.$store.dispatch('fetchBudgetItems')
  },
  computed: {
    ...mapState(['Budgets']),
    attributes() {
      let items = this.$store.state.Budgets.budgetByItems
      let dates = this.$store.state.Budgets.budgetTotals
      return [
        ...items.map(res => ({
          dates: res.date,
          highlight: {
            backgroundColor: '#ff3860'
          },
          customData: res,
          popover: {
            slot: 'expense-row',
            visibility: 'hover'
          }
        }))
      ]
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
