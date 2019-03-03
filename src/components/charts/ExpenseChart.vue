<template>
  <div class="column is-three-fifths">
    <h2 class="subtitle">Daily Expenses</h2>
    <bar-chart :chart-data="datacollection" :options="chartOptions" width="50" height="25"></bar-chart>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import moment from "moment";
  import BarChart from "./Bar.js";
  import numeral from "numeral";
  export default {
    created() {
      this.fillData();
    },
    computed: {
      ...mapState(["dailyExpenses"])
    },
    components: { BarChart },
    data() {
      return {
        chart: false,
        datacollection: null,
        chartOptions: {
          plugins: {
            labels: {
              render: function(args) {
                return numeral(args.value).format("$0");
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
            text: "Daily Expenses"
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function(value) {
                    return "$" + value;
                  }
                }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var dataLabel = data.datasets[tooltipItem.datasetIndex].label;
                return dataLabel + ": $" + tooltipItem.yLabel;
              }
            }
          }
        }
      };
    },
    methods: {
      fillData() {
        this.chart = true;
        let state = this.$store.state.dailyExpenses;
        let dates = [];
        let amounts = [];
        let start = this.$store.state.budgetDates[0].start;
        let end = this.$store.state.budgetDates[0].end;

        state.forEach(doc => {
          let date = moment(doc.date).toISOString();
          if (date > start && date < end) {
            dates.push(moment(doc.date).format("MMM Do"));
            amounts.push(parseFloat(doc.amount).toFixed(2));
          }
        });

        this.datacollection = {
          labels: dates,
          datasets: [
            {
              label: "Daily Expenses",
              data: amounts,
              backgroundColor: "#41A234",
              hoverBackgroundColor: "#2D6F24"
            }
          ]
        };
      }
    }
  };
</script>

