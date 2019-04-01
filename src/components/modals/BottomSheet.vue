<template>
  <v-bottom-sheet persistent="true" v-model="bottomSheet">
    <v-toolbar flat="true" dark color="purple accent-4">
      <v-btn icon dark @click="closeBS">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <IncModal />
  </v-bottom-sheet>
</template>

<script>
import { mapState } from 'vuex'
import IncModal from './IncModal'
export default {
  components: {
    IncModal
  },
  computed: {
    ...mapState(['bottomSheet'])
  },
  methods: {
    closeBS() {
      this.$store.state.bottomSheet = false
      this.$store.state.showIncomeModal = false
      this.$store.state.showExpenseModal = false
    }
  }
}
</script>
