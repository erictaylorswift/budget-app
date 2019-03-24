<template>
  <div class="list">
    <md-list>
      <md-list-item md-expand>
        <md-icon>attach_money</md-icon>
        <span class="md-list-item-text">Expense names</span>

        <md-list slot="md-expand">
          <md-list-item v-for="name in sortedNames" :key="name.id">
            {{ name }}
          </md-list-item>
        </md-list>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item md-expand>
        <md-icon>category</md-icon>
        <span class="md-list-item-text">Expense categories</span>
        <md-list slot="md-expand">
          <md-list-item
            v-for="category in Budgets.baseTypes"
            :key="category.id"
            >{{ category }}</md-list-item
          >
        </md-list>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item md-expand>
        <md-icon>monetization_on</md-icon>
        <span class="md-list-item-text">Income sources</span>
        <md-list slot="md-expand">
          <md-list-item
            v-for="category in Budgets.incomeSources"
            :key="category.id"
            >{{ category }}</md-list-item
          >
        </md-list>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  created() {
    this.$store.dispatch('fetchBaseCategories')
    this.$store.dispatch('fetchBaseTypes')
    this.$store.dispatch('fetchIncomeSources')
  },
  computed: {
    ...mapState(['Expenses', 'Budgets']),
    sortedNames() {
      let names = this.$store.state.Budgets.expensees
      names.sort()

      return names
    }
  },
  data() {
    return {
      showLess: true,
      categorization: true,
      account: false,
      expandSingle: false,
      expandNames: false
    }
  },
  methods: {
    switchAccount() {
      this.categorization = false
      this.account = true
    },
    switchCategorization() {
      this.categorization = true
      this.account = false
    }
  }
}
</script>
