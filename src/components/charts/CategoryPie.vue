<template>
  <div class="pie-chart-wrapper column is-two-fifths">
    <h2 class="subtitle">Amount spent by Category</h2>
    <pie-chart :chart-data="fillData" :options="chartOptions"></pie-chart>
  </div>
</template>

<script>
  import PieChart from "./Pie.js";
  import { mapState } from "vuex";
  import "chartjs-plugin-colorschemes";
  import _ from "lodash";

  export default {
    mounted() {
      this.$store.dispatch("fetchExpenseCategories");
    },
    computed: {
      ...mapState(["expenseCat"]),
      fillData() {
        let state = this.$store.state.expenseCat;
        // let category = [];
        let amounts = [];

        const Arr = state;
        const Property = "category";
        const amountByCategory = _.groupBy(Arr, Property);
        const category = Object.keys(amountByCategory);

        const omit = _.mapValues(amountByCategory, x =>
          x.map(y => _.omit(y, "category"))
        );
        const values = Object.values(omit);

        values.forEach(r => {
          let total = r.reduce(function(prev, curr) {
            return {
              amount: Number(prev.amount) + Number(curr.amount)
            };
          });

          amounts.push(Number(total.amount));
        });


        return {
          labels: category,
          datasets: [
            {
              label: "Expense Category",
              data: amounts
            }
          ]
        };
      }
    },
    components: { PieChart },
    data() {
      return {
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
          plugins: {
            colorschemes: {
              scheme: "tableau.Tableau20"
            },
            legend: false,
            outlabels: {
              text: "%l: $%v",
              color: "white",
              stretch: 45,
              font: {
                resizable: true,
                minSize: 14,
                maxSize: 18
              }
            },
            labels: {
              render: function() {
                return "";
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
      };
    },
    methods: {}
  };
</script>

