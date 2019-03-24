<template>
  <div class="pie-chart-wrapper">
    <h2 class="subtitle">Amount spent by Category</h2>
    <pie-chart :chart-data="fillData" :options="chartOptions"></pie-chart>
  </div>
</template>

<script>
import PieChart from './Pie.js'
import { mapState } from 'vuex'
import 'chartjs-plugin-colorschemes'
import _ from 'lodash'

export default {
  created() {
    this.$store.dispatch('fetchExpenseTotals')
  },
  computed: {
    ...mapState(['Expenses']),
    fillData() {
      let state = this.$store.state.Expenses.expenseCat
      // let category = [];
      let amounts = []

      const Arr = state
      const Property = 'category'
      const amountByCategory = _.groupBy(Arr, Property)
      const category = Object.keys(amountByCategory)

      const omit = _.mapValues(amountByCategory, x =>
        x.map(y => _.omit(y, 'category'))
      )
      const values = Object.values(omit)

      values.forEach(r => {
        let total = r.reduce(function(prev, curr) {
          return {
            amount: Number(prev.amount) + Number(curr.amount)
          }
        })

        amounts.push(Number(total.amount))
      })

      return {
        labels: category,
        datasets: [
          {
            label: 'Expense Category',
            data: amounts
          }
        ]
      }
    }
  },
  components: { PieChart },
  data() {
    return {
      colors: [
        'rgba(8, 126, 139, 1)',
        'rgba(255, 90, 95, 1)',
        'rgba(108, 197, 81, 1)',
        'rgba(125, 132, 178, 1)',
        'rgba(64, 71, 109, 1)',
        'rgba(8, 126, 139, 1)',
        'rgba(255, 90, 95, 1)',
        'rgba(108, 197, 81, 1)',
        'rgba(125, 132, 178, 1)',
        'rgba(64, 71, 109, 1)'
      ],
      datacollection: null,
      chartOptions: {
        zoomOutPercentage: 10,
        layout: {
          padding: {
            left: 50,
            right: 50,
            top: 100,
            bottom: 100
          }
        },
        color: this.colors,
        plugins: {
          legend: false,
          outlabels: {
            text: '%l: \n $%v',
            textAlign: 'center',
            color: 'white',
            stretch: 45,
            font: {
              resizable: true,
              minSize: 14,
              maxSize: 18
            }
          },
          labels: {
            render: function() {
              return ''
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    }
  },
  methods: {}
}
</script>
