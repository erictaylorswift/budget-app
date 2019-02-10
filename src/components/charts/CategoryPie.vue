<template>
    <div class="">
        <h2>Amount spent by Category</h2>
        <pie-chart :chart-data="datacollection" :options="chartOptions"></pie-chart>
    </div>
</template>

<script>
import PieChart from './Pie.js'
import { mapState } from 'vuex'
import 'chartjs-plugin-colorschemes'

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
                zoomOutPercentage: 10,
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 100,
                        bottom: 100
                    }
                },
                plugins: 
                {
                    colorschemes: {
                        scheme: 'tableau.Tableau20'
                    },
                    legend: false,
                    outlabels: {
                        text: '%l: $%v',
                        color: 'white',
                        stretch: 45,
                        font: {
                            resizable: true,
                            minSize: 14,
                            maxSize: 18
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                title: {
                    display: false
                },
                tooltips: {
                    enabled: false
                }
            },
        }
    },
    methods: {
        fillData() {
            let state = this.$store.state.expenseCategory;
            let category = []
            let amounts = []

            state.forEach(doc => {
                if (
                    doc.type != 'income' 
                    && doc.type != 'bills' 
                    && doc.spent != 0
                ) {
                    category.push(doc.type)
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

