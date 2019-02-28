<template>
    <v-calendar 
        :attributes="attributes" 
        :min-date='budgetDates[0].start'>
    </v-calendar>
</template>

<script>
import { mapState } from 'vuex';
// import moment from 'moment';

export default {
    created() {
        this.$store.dispatch('fetchBudgetItems')
    },
    data() {
        return {
            
        }
    },
    methods: {
        getDates() {
            let data = this.$store.state.budgetByItems;
            let dates = [];
            let popover = [];

            data.forEach(doc => {
                dates.push(new Date(doc.date))
                popover.push(doc.name)
            })
            this.attrs[0].dates = dates
            this.attrs[0].popover.label = popover
        }
    },
    computed: {
        ...mapState(['budgetByItems', 'budgetDates']),
        attributes() {
            let budgetDates = this.$store.state.budgetByItems;
            return [
                ...budgetDates.map(res => ({
                    dates: res.date,
                    bar: {
                        backgroundColor: '#ff8080'
                    },
                    popover: {
                        label: res.name != '' ? res.name : res.expenseType
                    }
                }))
            ]

        }
    }
}
</script>
