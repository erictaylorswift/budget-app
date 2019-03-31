<template>
  <fab
    :actions="fabActions"
    :position="position"
    :bg-color="bgColor"
    @new_expense="newExpense"
  ></fab>
</template>

<script>
import Fab from 'vue-fab'
export default {
  components: {
    Fab
  },
  data() {
    return {
      bgColor: '#3949AB',
      position: 'top-left',
      fabActions: [
        {
          name: 'new_expense',
          icon: 'add'
        }
      ]
    }
  },
  methods: {
    newExpense() {
      this.$store.state.showExpenseModal = true
    }
  }
}
</script>
