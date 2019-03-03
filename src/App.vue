<template>
  <div id="main" class="container">
    <Nav></Nav>
    <Expenses/>
    <Income/>
    <router-view/>
  </div>
</template>

<script>
import Nav from './components/Nav'
import Expenses from './components/Expenses'
import Income from './components/Income'
export default {
  components: {
    Nav,
    Expenses,
    Income
  },
  created() {
    this.$store.dispatch('fetchExpensesByDay')
  }
}
</script>
