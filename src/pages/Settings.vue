<template>
  <div class="container fluid">
    <div>
      <v-tabs color="grey lighten-5" class="mb-4">
        <v-tabs-slider></v-tabs-slider>
        <v-tab @click="switchView('Categorization')">Categorization</v-tab>
        <v-tab @click="switchView('Account')">Account</v-tab>
      </v-tabs>
    </div>
    <component v-bind:is="view"></component>
  </div>
</template>

<script>
import Categorization from '../components/settings/Cats.vue'
import Account from '../components/settings/Account.vue'
export default {
  data() {
    return {
      view: 'Categorization',
      fab: false
    }
  },
  components: {
    Categorization,
    Account
  },
  methods: {
    switchView(name) {
      this.view = name
    }
  }
}
</script>
