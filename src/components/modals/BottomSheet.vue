<template>
  <v-bottom-sheet persistent="true" v-model="bottomSheet">
    <v-toolbar flat="true" dark color="purple accent-4">
      <v-btn icon dark @click="closeBS">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <IncModal />
    <ExpenseModal />
    <ExpCatModal />
    <ExpTypeModal />
    <NewIncSourceModal />
  </v-bottom-sheet>
</template>

<script>
import { mapState } from 'vuex'
import IncModal from './IncModal'
import ExpenseModal from './Expenses'
import ExpCatModal from './NewExpCat'
import ExpTypeModal from './NewExpType'
import NewIncSourceModal from './NewIncomeSource'
export default {
  components: {
    IncModal,
    ExpenseModal,
    ExpCatModal,
    ExpTypeModal,
    NewIncSourceModal
  },
  computed: {
    ...mapState(['bottomSheet'])
  },
  methods: {
    closeBS() {
      this.$store.state.bottomSheet = false
      this.$store.state.showIncomeModal = false
      this.$store.state.showExpenseModal = false
      this.$store.state.showNewNameModal = false
      this.$store.state.showNewCatModal = false
      this.$store.state.showNewIncSourceModal = false
    }
  }
}
</script>
