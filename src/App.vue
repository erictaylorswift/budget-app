<template>
  <div id="main">
    <Nav></Nav>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav'
import Main from './components/Main'
export default {
  components: {
    Nav,
    Main
  }
}
</script>
