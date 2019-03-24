<template>
  <div>
    <h2 class="subtitle">Daily Expenses</h2>
    <line-chart
      :chart-data="fillData"
      :options="chartOptions"
      width="50"
      height="25"
    ></line-chart>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import LineChart from './Line.js'
import numeral from 'numeral'
export default {
  computed: {
    fillData() {
      let state = this.$store.state.Expenses.expenses
      // let category = [];
      let amounts = []

      const Arr = state
      const Property = 'date'
      const amountByDate = _.groupBy(Arr, Property)
      const date = Object.keys(amountByDate)
      const omit = _.mapValues(amountByDate, x => x.map(y => _.omit(y, 'date')))
      const values = Object.values(omit)

      values.forEach(r => {
        let total = r.reduce(function(prev, curr) {
          return {
            amount: Number(prev.amount) + Number(curr.amount)
          }
        })

        amounts.push(Number(total.amount).toFixed(2))
      })
      let formattedDate = []
      date.forEach(d => {
        formattedDate.push(moment(d).format('MMM Do'))
      })
      return {
        labels: formattedDate,
        datasets: [
          {
            label: 'Daily Expenses',
            data: amounts,
            fill: false,
            borderColor: '#DE0954',
            pointBackgroundColor: '#540047'
          }
        ]
      }
    }
  },
  components: { LineChart },
  data() {
    return {
      datacollection: null,
      chartOptions: {
        plugins: {
          labels: {
            render: function(args) {
              return numeral(args.value).format('$0')
            }
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 100,
            top: 60,
            bottom: 60
          }
        },
        responsive: true,
        maintainAspectRation: false,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        legend: {
          display: false
        },
        title: {
          display: false,
          text: 'Daily Expenses'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function(value) {
                  return '$' + value
                }
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataLabel = data.datasets[tooltipItem.datasetIndex].label
              return dataLabel + ': $' + tooltipItem.yLabel
            }
          }
        }
      }
    }
  },
  methods: {}
}
</script>
