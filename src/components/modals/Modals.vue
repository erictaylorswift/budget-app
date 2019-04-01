<template>
  <div>
    <ExpenseModal />
    <NewExpCatModal />
    <NewExpTypeModal />
    <NewIncomeSourceModal />
  </div>
</template>

<script>
import ExpenseModal from './Expenses'
import NewExpCatModal from './NewExpCat'
import NewExpTypeModal from './NewExpType'
import NewIncomeSourceModal from './NewIncomeSource'
export default {
  components: {
    ExpenseModal,
    NewExpCatModal,
    NewExpTypeModal,
    NewIncomeSourceModal
  }
}
</script>
