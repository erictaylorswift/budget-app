<template>
  <div id="app">
    <Budget></Budget>
    <Expenses></Expenses>
    <Home></Home>
  </div>
</template>

<script>
import Expenses from './components/Expenses';
import Budget from './components/Budget';
import Home from './components/Home';

export default {
  components: { 
    Expenses,
    Budget,
    Home
  }

}
</script>