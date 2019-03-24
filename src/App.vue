<template>
  <v-app>
    <Nav></Nav>
    <Modals />
    <v-content>
      <v-content-fluid>
        <router-view />
      </v-content-fluid>
    </v-content>
  </v-app>
</template>

<script>
import Nav from './components/Nav'
import Modals from './components/modals/Modals'
export default {
  components: {
    Nav,
    Modals
  }
}
</script>
