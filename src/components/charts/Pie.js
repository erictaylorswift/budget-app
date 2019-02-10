import { Doughnut, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import Outlabels from 'chartjs-plugin-piechart-outlabels'

export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    plugins: [Outlabels],
    props: ['options'],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}