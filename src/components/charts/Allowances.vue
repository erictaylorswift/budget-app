<template>
    <div>
        <bar-chart></bar-chart>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import BarChart from './Bar.js'
export default {
    created() {
        this.$store.dispatch('fetchAllowances')
    },
    components: { BarChart },
    computed: {
        ...mapState(['expenses'])
    },
    data() {
        return {
            chartOptions: {

            }
        }
    }
}
</script>

