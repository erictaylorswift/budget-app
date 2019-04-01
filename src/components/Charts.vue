<template>
  <div class="flex">
    <daily-expense></daily-expense>
    <category-pie></category-pie>
  </div>
</template>

<script>
import DailyExpense from './charts/ExpenseChart'
import CategoryPie from './charts/CategoryPie'

export default {
  components: {
    DailyExpense,
    CategoryPie
  }
}
</script>
