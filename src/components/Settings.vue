<template>
  <div>
    <div class="tabs is-medium">
      <ul>
        <li v-bind:class="{ 'is-active': this.view == 'Categorization'}">
          <a @click="switchView('Categorization')">Categorization</a>
        </li>
        <li v-bind:class="{ 'is-active': this.view == 'Account'}">
          <a @click="switchView('Account')">Account</a>
        </li>
      </ul>
    </div>
    <transition name="fade" mode="out-in">
      <component v-bind:is="view"></component>
    </transition>
  </div>
</template>

<script>
  import Categorization from "./settings/Categorization";
  import Account from "./settings/Account.vue";
  export default {
    data() {
      return {
        view: "Categorization"
      };
    },
    components: {
      Categorization,
      Account
    },
    methods: {
      switchView(name) {
        this.view = name;
      }
    }
  };
</script>

