<template>
    <div class=""> 
        <h2 class="subtitle">Daily Expenses</h2>
        <bar-chart :chart-data="datacollection" :options="chartOptions" width="500" height="300"></bar-chart>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import BarChart from './Bar.js'
import numeral from 'numeral'
export default {
    created() {
        this.fillData()
        this.$store.dispatch('fetchExpensesByDay')
    },
    computed: {
        ...mapState(['expensesByDay']),
        fetchTotals() {
            let expenses = this.$store.state.expensesByDay;
            let totalsArr = [];
            expenses.forEach(doc => {
                totalsArr.push(doc.expenseTotal)
            })

            let totals = totalsArr.reduce((a,b) => a+b, 0)

            return totals
        }
    },
    components: { BarChart },
    data() {
        return {
            chart: false,
            datacollection: null,
            chartOptions: {
                plugins: {
                   labels: {
                        render: function (args) {
                            return numeral(args.value).format('$0');
                        },
                        fontStyle: 'bold',
                    }
                },
                responsive: false,
                maintainAspectRation: false,
                categoryPercentage: 1.0,
                barPercentage: 1.0,
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                    text: 'Daily Expenses'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataLabel = data.datasets[tooltipItem.datasetIndex].label;
                            return dataLabel + ': $' + tooltipItem.yLabel
                        }
                    }
                }
            }
        }
    },
    methods: {
        fillData() {
            this.chart = true
            let state = this.$store.state.expensesByDay;
            let dates = []
            let amounts = []

            state.forEach(doc => {
                dates.push(moment(doc.date).format('MMM D'))
                amounts.push(parseFloat(doc.expenseTotal).toFixed(2))
            })

            this.datacollection = {
                labels: dates,
                datasets: [
                    {
                        label: 'Daily Expenses',
                        data: amounts,
                        backgroundColor: '#41A234',
                        hoverBackgroundColor: '#2D6F24'
                    }
                ]
            }
        }
    }
}
</script>

