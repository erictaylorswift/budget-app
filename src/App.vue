<template>
  <div id="app">
    <Budget></Budget>
    <Income></Income>
    <Expenses></Expenses>
    <Home></Home>
  </div>
</template>

<script>
import Expenses from './components/Expenses';
import Budget from './components/Budget';
import Home from './components/Home';
import Income from './components/Income'

export default {
  components: { 
    Expenses,
    Budget,
    Home,
    Income
  }

}
</script>