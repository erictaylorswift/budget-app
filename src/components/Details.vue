<template>
    <div>
        <div class="flex">
            <h2 class="header">Expense Details</h2>
        </div>
        <div class="flex">
            <BillsTable></BillsTable>
        </div>
    </div>
</template>

<script>
import BillsTable from './BillsTable'

export default {
    components: { BillsTable }
}
</script>

