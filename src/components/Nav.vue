<template>
  <div v-if="currentUser">
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <v-btn flat @click="goHome">Budgie</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="newIncome" color="green darken-2"
          >Add income <v-icon right>account_balance_wallet</v-icon></v-btn
        >
        <v-btn color="orange darken-2" flat @click="newExpense"
          >Add expense <v-icon right>money</v-icon></v-btn
        >
        <v-btn flat color="purple" @click="goTo('/budget')">
          New budget
          <v-icon right>fiber_new</v-icon>
        </v-btn>
        <v-btn flat @click="logout" color="grey">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="currentUser.photoURL" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ currentUser.displayName }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0 px-3" dense>
        <v-divider class="mb-4"></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="goTo(item.route)"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="mt-5"></v-divider>
        <v-list-tile @click="goTo('/settings')" class="mt-3">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'dashboard', route: '/home' },
        { title: 'Expenses', icon: 'attach_money', route: '/expenses' },
        {
          title: 'Budget Overview',
          icon: 'account_balance_wallet',
          route: '/current-budget'
        }
      ]
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    },
    goHome() {
      this.$router.push('home')
    },
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.commit('setCurrentUser', null)
          this.$router.push('login')
        })
        .catch(err => {
          alert(err)
        })
    },
    newExpense() {
      this.$store.state.bottomSheet = true
      this.$store.state.showIncomeModal = false
      this.$store.state.showExpenseModal = true
    },
    newIncome() {
      this.$store.state.bottomSheet = true
      this.$store.state.showExpenseModal = false
      this.$store.state.showIncomeModal = true
    }
  }
}
</script>
