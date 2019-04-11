<template>
  <div class="gradient_bg">
    <v-layout justify-center>
      <v-flex align-center justify-center xs8>
        <v-stepper v-model="e1" style="width: 100%">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1" alt-labels
              >Add income sources</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2" alt-labels
              >Add expense sources</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="3" alt-labels
              >Add budget dates</v-stepper-step
            >
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="elevation-12">
                <v-toolbar dark color="purple darken-3">
                  <v-toolbar-title
                    >Let's start with adding your source of
                    income</v-toolbar-title
                  ><v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-card class="py-5">
                    <v-card-title>
                      <span class="headline">Add new income source</span>
                    </v-card-title>
                    <v-card-text>
                      <v-layout>
                        <v-flex>
                          <v-text-field
                            v-model="newSource"
                            label="Add source name"
                            type="text"
                            @keyup.13="pushSource"
                          ></v-text-field>
                          <v-btn icon small @click="pushSource">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex>
                          <v-chip light v-for="s in sources" :key="s">{{
                            s
                          }}</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        fab
                        medium
                        color="success"
                        @click="addSource"
                        absolute
                        right
                      >
                        <v-icon>check</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="px-5 pt-5" flat>
                <v-card-title>
                  <span class="headline">Add new expense category</span>
                </v-card-title>
                <v-card-text>
                  <v-layout align-center>
                    <v-flex>
                      <v-text-field
                        v-model="newCat"
                        label="Category name"
                        class="mr-3"
                      ></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        v-model="newName"
                        label="Add expense source"
                        append-icon="done"
                        @click:append="addName"
                        @keyup.13="addName"
                        type="text"
                        class="mr-4"
                      ></v-text-field>
                    </v-flex>
                    <v-flex align-end justify-end>
                      <v-btn
                        medium
                        color="success"
                        @click="addCategory"
                        v-if="length"
                      >
                        Submit
                        <v-icon small right>check</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-layout class="mb-5">
                  <v-flex align-center>
                    <v-layout column>
                      <span class="headline mb-2 px-2">{{ newCat }}</span>
                      <div class="text-center">
                        <v-chip
                          v-for="item in catNames"
                          :key="item"
                          close
                          @input="remove(item)"
                          >{{ item }}</v-chip
                        >
                      </div>
                    </v-layout>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      color="blue"
                      v-if="this.catNames.length > 0"
                      @click="plusCat"
                      >Add another <v-icon small right>add</v-icon></v-btn
                    >
                  </v-flex>
                </v-layout>
                <v-card-actions>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
              <v-data-iterator
                :items="allCats"
                hide-actions
                row
                wrap
                content-tag="v-layout"
                class="px-5 pb-5"
                no-data-text=""
              >
                <template slot="item" slot-scope="props">
                  <v-flex xs2>
                    <v-card>
                      <v-card-title>
                        <h4>{{ props.item.name }}</h4>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-list-dense>
                        <v-list-tile
                          v-for="name in props.item.sources"
                          :key="name"
                        >
                          <v-list-tile-content class="pr-5 body-1">
                            {{ name }}
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list-dense>
                    </v-card>
                  </v-flex>
                </template>
              </v-data-iterator>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-layout wrap column>
                <v-flex class="text-center" justify-center>
                  <h2 class="display-1 purple--text font-weight-bold mb-1">
                    Up next...
                  </h2>
                </v-flex>
                <v-flex class="text-center" justify-center>
                  <p class="body-2">Create your first budget</p>
                </v-flex>
                <v-flex justify-center>
                  <v-btn
                    class="mt-5"
                    dark
                    round
                    color="purple accent-3"
                    @click="goBudget"
                    >Go now <v-icon right small>thumb_up</v-icon></v-btn
                  >
                </v-flex>
              </v-layout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
const fb = require('../firebaseConfig')
export default {
  created() {
    this.$store.state.showNewIncSourceModal = true
    this.uid = this.$store.state.currentUser.uid
  },
  computed: {
    length() {
      if (this.allCats.length > 0) {
        return true
      }
      return false
    }
  },
  data() {
    return {
      e1: 0,
      menu: false,
      error: false,
      errMsg: '',
      newSource: '',
      uid: '',
      sources: [],
      newName: '',
      newCat: '',
      catNames: [],
      allCats: [],
      budgetDates: [],
      budgie_full: require('../assets/images/budgie_full.jpg')
    }
  },
  methods: {
    addSource() {
      let cat = this.sources
      let uid = this.$store.state.currentUser.uid
      let source = { source: [] }

      let docRef = fb.db.collection('IncomeSources').doc(uid)

      docRef.set({ source: cat }).catch(err => {
        this.error = true
        this.errMsg = err
      })

      if (this.error) {
        this.$toasted.global.error({
          message: this.errMsg
        })
      } else {
        this.$toasted.global.success({
          message: 'Success!'
        })
        this.$store.dispatch('fetchIncomeSources')
        this.newSource = ''
        this.sources = []
        this.error = false
        this.errMsg = ''
        this.e1 = 2
      }
    },
    pushSource() {
      let sources = this.sources

      sources.push(this.newSource)

      this.newSource = ''
    },
    addName() {
      if (this.newName != '') {
        this.catNames.push(this.newName)
      }

      this.newName = ''
    },
    addCategory() {
      let fullList = this.allCats
      let uid = this.$store.state.currentUser.uid
      let docRef = fb.db.collection('ExpenseTypes').doc(uid)

      fullList.forEach(c => {
        let catName = c.name
        let sourceArr = c.sources
        docRef
          .set({
            [catName]: sourceArr
          })
          .catch(err => {
            this.error = true
            this.errMsg = err
          })
      })

      if (this.error) {
        this.$toasted.gloabl.error({
          message: this.errMsg
        })
      } else {
        this.$toasted.global.success({
          message: "You've successfully added expense categories"
        })
        this.e1 = 3
      }
    },
    plusCat() {
      this.allCats.push({
        name: this.newCat,
        sources: this.catNames
      })
      this.newCat = ''
      this.catNames = []
    },
    goBudget() {
      this.$router.push('/budget')
    }
  }
}
</script>

<style>
.gradient_bg {
  background: linear-gradient(45deg, #f32f8e, #b236d0);
  height: 100%;
  padding: 80px 0;
}
</style>
