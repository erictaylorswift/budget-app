<template>
  <div class="columns" v-if="categorization">
    <div class="column panel">
      <div class="panel-heading">
        <div class="level">
          <p>Expense names</p>
          <a @click="openNewExpModal" class="link">
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
          <a @click="openNewCatModal" class="link">
            <i class="fas fa-plus-square"></i>
          </a>
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
          <a @click="openIncSourceModal" class="link">
            <i class="fas fa-plus-square"></i>
          </a>
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
        showLess: true,
        categorization: true,
        account: false
      };
    },
    methods: {
      openNewExpModal() {
        this.$store.state.showNewNameModal = true;
      },
      expand() {
        this.showLess = false;
      },
      contract() {
        this.showLess = true;
      },
      openNewCatModal() {
        this.$store.state.showNewCatModal = true;
      },
      openIncSourceModal() {
        this.$store.state.showNewIncSourceModal = true;
      },
      switchAccount() {
        this.categorization = false;
        this.account = true;
      },
      switchCategorization() {
        this.categorization = true;
        this.account = false;
      }
    }
  };
</script>

