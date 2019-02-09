import { Doughnut, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    plugins: [ChartDataLabels],
    props: ['options'],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}