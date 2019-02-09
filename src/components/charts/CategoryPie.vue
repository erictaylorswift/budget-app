<template>
    <div class="one-third">
        <h2>Amount spent by Category</h2>
        <pie-chart :chart-data="datacollection" :options="chartOptions"></pie-chart>
    </div>
</template>

<script>
import PieChart from './Pie.js'
import { mapState } from 'vuex'
import 'chartjs-plugin-colorschemes'
import numeral from 'numeral'

export default {
    created() {
        this.$store.dispatch('fetchExpenseCategory')
        this.fillData()
    },
    computed: {
        ...mapState(['expenseCategory'])
    },
    components: { PieChart },
    data() {
        return {
            datacollection: null,
            chartOptions: {
                plugins: 
                {
                    colorschemes: {
                        scheme: 'tableau.Tableau20'
                    },
                    datalabels: {
                        color: '#fff'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                title: {
                    display: false
                }
            },
        }
    },
    methods: {
        fillData() {
            let state = this.$store.state.expenseCategory;
            let category = []
            let amounts = []
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'CAD',
                minimumFractionDigits: 2
            })

            state.forEach(doc => {
                if (
                    doc.category != 'income' 
                    && doc.category != 'bills' 
                    && doc.spent != 0
                ) {
                    category.push(doc.category)
                    amounts.push((doc.spent))
                }
                
            })

            this.datacollection = {
                labels: category,
                datasets: [
                    {
                        label: 'Expense Category',
                        data: amounts
                    }
                ]
            }
        }
    }
    
}
</script>

