<template>
  <div class="columns">
    <div class="column panel">
      <div class="panel-heading">
        <div class="level">
          <p>Expense names</p>
          <a @click="openModal" class="link">
            <i class="fas fa-plus-square"></i>
          </a>
        </div>
      </div>
      <ul v-if="showLess">
        <li class="panel-block" v-for="name in expensees.slice(0, 5)" :key="name.id">{{ name }}</li>
        <li class="panel-block panel-with-background">
          <div class="level w-100">
            <p class="level-left">...</p>
            <a class="level-right expand-collapse" @click="expand">
              <i class="fas fa-angle-double-down"></i>
            </a>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li class="panel-block" v-for="name in expensees" :key="name.id">{{ name }}</li>
        <li class="panel-block">
          <div class="level w-100">
            <p></p>
            <a @click="contract" class="level-right expand-collapse">
              <i class="fas fa-angle-double-up"></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="column panel">
      <div class="panel-heading">
        <div class="level">
          <p>Expense categories</p>
        </div>
      </div>
      <ul>
        <li class="panel-block" v-for="name in baseTypes" :key="name.id">{{ name }}</li>
      </ul>
    </div>
    <div class="column panel">
        <div class="panel-heading">
            <div class="level">
                <p>Income sources</p>
            </div>
        </div>
        <ul>
            <li class="panel-block" v-for="name in incomeSources" :key="name.id">{{ name }}</li>
        </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    created() {
      this.$store.dispatch("fetchBaseCategories");
      this.$store.dispatch("fetchBaseTypes");
      this.$store.dispatch("fetchIncomeSources");
    },
    computed: {
      ...mapState(["expensees", "baseTypes", "incomeSources"])
    },
    data() {
      return {
        expCats: [
          "Credit",
          "Loans",
          "Housing",
          "Transportation",
          "Family",
          "Insurance",
          "Personal"
        ],
        showLess: true
      };
    },
    methods: {
      openModal() {
        this.$store.state.showNewNameModal = true;
      },
      expand() {
        this.showLess = false;
      },
      contract() {
        this.showLess = true;
      }
    }
  };
</script>

