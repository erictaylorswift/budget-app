<template>
  <v-container grid-list-md>
    <div class="ml-3">
      <h1 class="display-2">Your budget</h1>
      <h2 class="subheading">
        {{ start | formatDate }} to {{ end | formatDate }}
      </h2>
    </div>
    <Overview />
    <v-layout wrap row align-top>
      <Spent />
      <Progress />
    </v-layout>
    <Drawer />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import numeral from 'numeral'
import Overview from '@/components/BudgetOverview'
import Spent from '@/components/Spent'
import Progress from '@/components/Progress'

export default {
  components: {
    Overview,
    Spent,
    Progress
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
      }
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
