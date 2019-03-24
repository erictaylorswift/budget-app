<template>
  <div class="container">
    <h1 class="md-display-1">Settings</h1>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66">
        <md-tabs>
          <md-tab
            id="categorization"
            md-label="Categorization"
            @click="switchView('Categorization')"
          ></md-tab>
          <md-tab
            id="account"
            md-label="Account"
            @click="switchView('Account')"
          ></md-tab>
        </md-tabs>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66">
        <transition name="fade" mode="out-in">
          <component v-bind:is="view"></component>
        </transition>
      </div>
    </div>
    <md-speed-dial md-event="click" class="md-bottom-left">
      <md-speed-dial-target class="md-accent">
        <md-icon class="md-morph-initial">add</md-icon>
        <md-icon class="md-morph-final">close</md-icon>
      </md-speed-dial-target>
      <md-speed-dial-content>
        <md-button class="md-icon-button">
          <md-icon>attach_money</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="openNewCatModal">
          <md-icon>category</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="openIncSourceModal">
          <md-icon>monetization_on</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
  </div>
</template>

<script>
import Categorization from '../components/settings/Cats.vue'
import Account from '../components/settings/AccountSettings.vue'
export default {
  data() {
    return {
      view: 'Categorization'
    }
  },
  components: {
    Categorization,
    Account
  },
  methods: {
    switchView(name) {
      this.view = name
    },
    openIncSourceModal() {
      this.$store.state.showNewIncSourceModal = true
    },
    openNewCatModal() {
      this.$store.state.showNewCatModal = true
    },
    openNewExpModal() {
      this.$store.state.showNewNameModal = true
    }
  }
}
</script>
