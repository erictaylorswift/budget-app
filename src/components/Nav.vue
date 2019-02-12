<template>
    <div class="nav" v-if="currentUser">
        <a @click="goHome" class="home middle">
            <i class="nes-logo"></i>
            Home
        </a>
        <div class="links">
            <a @click="viewExpenses">
               Expenses
            </a>
            <a @click="currentBudget">Budgets</a>
            <a @click="logout">Logout</a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig');
export default {
    computed: {
        ...mapState(['currentUser'])
    },
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
        },
        logout() {
            fb.auth.signOut().then(() => {
                this.$store.commit('setCurrentUser', null)
                this.$router.push('login')
            }).catch(err => {
                alert(err)
            })
            
        }
    }
    
}
</script>

