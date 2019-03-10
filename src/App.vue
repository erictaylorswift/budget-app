<template>
  <div id="main" class="container">
    <Nav></Nav>
    <Expenses/>
    <Income/>
    <NewExpType/>
    <router-view/>
  </div>
</template>

<script>
import Nav from './components/Nav'
import Expenses from './components/modals/Expenses'
import Income from './components/modals/Income'
import NewExpType from './components/modals/NewExpType'
export default {
  components: {
    Nav,
    Expenses,
    Income,
    NewExpType
  },
  created() {
    this.$store.dispatch('fetchExpensesByDay')
  }
}
</script>
