<template>
    <div>
        <ExpenseModal/>
        <IncomeModal/>
        <NewExpCatModal/>
        <NewExpTypeModal/>
        <NewIncomeSourceModal/>
    </div>
</template>

<script>
import ExpenseModal from './Expenses';
import IncomeModal from './Income';
import NewExpCatModal from './NewExpCat';
import NewExpTypeModal from './NewExpType';
import NewIncomeSourceModal from './NewIncomeSource'
export default {
    components: {
        ExpenseModal,
        IncomeModal,
        NewExpCatModal,
        NewExpTypeModal,
        NewIncomeSourceModal
    }
}
</script>
