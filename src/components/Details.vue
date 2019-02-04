<template>
    <div>
        <div class="flex">
            <h2 class="header">Expense Details</h2>
        </div>
        <div class="flex">
            <BillsTable></BillsTable>
        </div>
        <a @click="goHome" class="top-right flex middle">
            <i class="nes-logo"></i>
            Home
        </a>
    </div>
</template>

<script>
import BillsTable from './BillsTable'

export default {
    components: { BillsTable },
    methods: {
        goHome() {
            this.$router.push('/')
        }
    }    
}
</script>

