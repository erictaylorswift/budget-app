<template>
  <div id="main" class="container">
    <Nav></Nav>
    <Modals />
    <router-view />
  </div>
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
