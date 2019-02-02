<template>
    <div>
        <div class="flex">
            <h2 class="header">Expense Details</h2>
        </div>
        <div class="flex">
            <Bills></Bills>
            <Allowances></Allowances>
        </div>
        <a @click="goHome" class="top-right flex middle">
            <i class="nes-logo"></i>
            Home
        </a>
    </div>
</template>

<script>
import Bills from './Bills'
import Allowances from './Allowances'

export default {
    components: { Bills, Allowances },
    methods: {
        goHome() {
            this.$router.push('/')
        }
    }    
}
</script>

