<template>
  <v-app>
    <Nav />
    <modals />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from './components/Nav'
import Modals from './components/modals/BottomSheet'
export default {
  components: {
    Nav,
    Modals
  }
}
</script>
