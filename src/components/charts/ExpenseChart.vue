<template>
    <div class="nes-container half"> 
        <bar-chart :chart-data="datacollection" :options="chartOptions" width="50" height="25"></bar-chart>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import BarChart from './Bar.js'
export default {
    created() {
        this.$store.dispatch('fetchDailyExpenses')
        this.fillData()
    },
    computed: {
        ...mapState(['dailyExpenses']),

    },
    components: { BarChart },
    data() {
        return {
            chart: false,
            datacollection: null,
            chartOptions: {
                responsive: true,
                maintainAspectRation: false,
                categoryPercentage: 1.0,
                barPercentage: 1.0,
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                    text: 'Daily Expenses'
                }
            }
        }
    },
    methods: {
        fillData() {
            this.chart = true
            let state = this.$store.state.dailyExpenses;
            let dates = []
            let amounts = []

            state.forEach(doc => {
                dates.push(moment(doc.date).format("MMM Do"))
                amounts.push(parseInt(doc.amount))
            })

            this.datacollection = {
                labels: dates,
                datasets: [
                    {
                        label: 'Daily Expenses',
                        data: amounts,
                        backgroundColor: '#f87979'
                    }
                ]
            }
        }
    }
}
</script>

