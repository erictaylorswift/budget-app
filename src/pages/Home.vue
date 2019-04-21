<template>
  <v-container grid-list-md>
    <div class="ml-3">
      <h1 class="display-2">Your budget</h1>
      <h2 class="subheading" v-if="dates">
        {{ dates.start | formatDate }} to {{ dates.end | formatDate }}
      </h2>
    </div>
    <Overview />
    <v-layout wrap row align-top>
      <Spent />
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'
import Overview from '@/components/BudgetOverview'
import Spent from '@/components/Spent'

export default {
  components: {
    Overview,
    Spent
  },
  computed: {
    ...mapGetters(['dates'])
  },
  data() {
    return {
      options: {
        text: {
          color: '#fff',
          fontSize: 16,
          dynamicPosition: true
        },
        progress: {
          color: '#2dbd2d'
        },
        layout: {
          type: 'circle',
          horiztontalTextAlign: 20
        }
      },
      start: 'No Dates',
      end: ''
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
    },
    formatPercent(val) {
      let value = val / 100
      let percent = numeral(value).format('0%')
      return percent
    }
  }
}
</script>
