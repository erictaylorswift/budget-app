<template>
    <div>
        <div class="flex">
            <router-link to="/" class="details-home-link">
                <i class="nes-logo"></i>
            </router-link>
            <h2 class="details-title">Expense Details</h2>
        </div>
        <div class="flex">
            <Bills></Bills>
            <Allowances></Allowances>
        </div>
    </div>
</template>

<script>
import Bills from './Bills'
import Allowances from './Allowances'

export default {
    components: { Bills, Allowances }    
}
</script>

