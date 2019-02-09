<template>
    <div class="nav">
        <a @click="goHome" class="home middle">
            <i class="nes-logo"></i>
            Home
        </a>
        <div class="links">
            <a @click="viewExpenses">
                View expenses
            </a>
            <a @click="currentBudget">Budgets</a>
            <a @click="expenseChart">View Charts</a>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        viewExpenses() {
            this.$router.push('expenses')
        },
        currentBudget() {
            this.$router.push('current-budget')
        },
        expenseChart() {
            this.$router.push('/charts')
        },
        goHome() {
            this.$router.push('/')
        }
    }
    
}
</script>

