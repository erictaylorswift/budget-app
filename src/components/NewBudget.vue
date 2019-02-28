<template>
    <div class="container">
        <div class="buttons is-right">
            <button @click="saveBudget" class="button is-outlined is-primary is-rounded">Save budget</button>
        </div>
        <div class="columns">
            <div class="field column is-one-fifth">
                <label class="label">Start Date</label>
                <div class="control is-large">
                    <datepicker 
                        input-class='input' 
                        placeholder="mm/dd/yyyy" 
                        v-model="start"
                        typeable=true>
                    </datepicker>
                </div>
            </div>
            <div class="field column is-one-fifth">
                <label class="label">Start Date</label>
                <div class="control is-large">
                    <datepicker 
                        input-class='input' 
                        placeholder="mm/dd/yyyy" 
                        v-model="end"
                        typeable=true>
                    </datepicker>
                </div>
            </div>
        </div>
        <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical is-6">
                <article class="tile is-child notification is-primary">
                    <p class="title">
                        Input budget item
                    </p>
                    <div class="content columns">
                        <div class="control column">
                            <label class="label">Income or Expense</label>
                            <label class="radio">
                                <input type="radio" value="Income" v-model="budgetLine.budgetType">
                                Income
                            </label>
                            <label class="radio">
                                <input type="radio" value="Expense" v-model="budgetLine.budgetType">
                                Expense
                            </label>
                        </div>
                        <div class="field column" v-if="budgetLine.budgetType == 'Expense'">
                            <label class="label">Expense type</label>
                            <div class="select">
                                <select v-model="budgetLine.expenseType">
                                    <option disabled value="">Select type</option>
                                    <option disabled value="">-- Misc. --</option>
                                    <option>Groceries</option>
                                    <option>Allowances</option>
                                    <option>Savings</option>
                                    <option>Child Care</option>
                                    <option>Prescriptions</option>
                                    <option>Rent</option>
                                    <option disabled value="">-- Bills --</option>
                                    <option>Credit</option>
                                    <option>Loans</option>
                                    <option>Hydro</option>
                                    <option>Car</option>
                                    <option>Cell phone</option>
                                    <option>Internet</option>
                                    <option>Insurance</option>
                                    <option>Subscriptions</option>
                                    <option>Gym</option>
                                </select>
                            </div>
                        </div>
                        <div class="field column">
                            <label class="label" v-if="budgetLine.budgetType == 'Expense'">Expensee</label>
                            <label class="label" v-else>Income source</label>
                            <div class="control">
                                <input type="text" class="input" v-model="budgetLine.name">
                            </div>
                        </div>
                    </div>
                </article>
                <article 
                    class="tile is-child notification is-info"
                    v-if="budgetLine.budgetType == 'Income' || budgetLine.expenseType != ''">
                    <div class="content columns">
                        <div class="field column">
                            <label class="label">Budgeted amount</label>
                            <div class="control has-icons-left">
                                <input class="input" type="number" step=".01" v-model="budgetLine.amount">
                                <span class="icon is-left is-medium">
                                    <i class="fas fa-dollar-sign"></i>
                                </span>
                            </div>
                        </div>
                        <div class="field column">
                            <label class="label">Budget Date</label>
                            <div class="control is-large">
                                <datepicker 
                                    input-class='input' 
                                    placeholder="mm/dd/yyyy" 
                                    v-model="budgetLine.date"
                                    typeable=true>
                                </datepicker>
                            </div>
                        </div>
                    </div>
                    <button @click="saveItem" class="button is-rounded is-info is-inverted is-outlined is-medium" v-bind:disabled="budgetLine.amount == ''">
                        Add budget item
                    </button>
                </article>
            </div>
            <div class="tile is-parent is-vertical">
                <div class="tile notification is-warning">
                    <v-table :data="budgetItem" class="table">
                        <thead slot="head">
                            <th>Date</th>
                            <th>Budget Type</th>
                            <th>Expense Type</th>
                            <th>Source</th>
                            <th>Amount</th>
                        </thead>
                        <tbody slot="body" slot-scope="{displayData}">
                            <tr v-for="row in displayData" :key="row.index">
                                <td v-if="row.date != '' || row.date == null">{{row.date | formatDate}}</td>
                                <td v-else>--</td>
                                <td>{{row.budgetType}}</td>
                                <td>{{row.expenseType}}</td>
                                <td>{{row.name}}</td>
                                <td>{{row.amount | formatCurrency}}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { mapState } from 'vuex';
import numeral from 'numeral';
const fb = require('../firebaseConfig')

export default {
    created() {
        this.$store.dispatch('fetchBudgetItems')
    },
    components: {
        Datepicker
    },
    computed: {
        ...mapState(['currentBudget', 'budgetItem', 'budgetByItems']),
    },
    data() {
        return {
            budgetLine: {
                date: '',
                budgetType: '',
                expenseType: '',
                amount: '',
                name: ''
            },
            start: '',
            end: '',
            newItem: []
        }
    },
    methods:  {
        saveItem() {
            let item = this.budgetLine;
            this.$store.dispatch('addBudgetItem', item)

            this.clearData();
            // this.newItem.push({...this.budgetLine})
        },
        saveBudget() {
            let budget = this.$store.state.budgetItem;
            let start = this.start;
            let end = this.end;
            let expenseArray = [];
            let incomeArray = [];

            this.deleteBudgetItems('BudgetItems');

            for (var i = 0; i<budget.length; i++) {

                if (budget[i].budgetType == 'Expense') {
                    expenseArray.push(Number(budget[i].amount))
                } else {
                    incomeArray.push(Number(budget[i].amount))
                }

                fb.db.collection('BudgetItems').add({
                    'date': moment(budget[i].date).toISOString(),
                    'type': budget[i].budgetType,
                    'expenseType': budget[i].expenseType,
                    'name': budget[i].name,
                    'amount': Number(budget[i].amount)
                })

                // if (budget[i].budgetType == 'Expense' && budget[i].expenseType == 'Bills') {
                //     fb.db.collection('ExpenseCategories').doc(budget[i].expenseCategory).set({
                //         'category': budget[i].expenseCategory,
                //         'budgeted': Number(budget[i].amount),
                //         'spent': 0
                //     })
                // } else if (budget[i].budgetType == 'Expense' && budget[i].expenseType != 'Bills') {
                //     fb.db.collection('ExpenseCategories').doc(budget[i].expenseType).set({
                //         'category': budget[i].expenseType,
                //         'budgeted': Number(budget[i].amount),
                //         'spent': 0
                //     })
                // }
            }

            let expenseTotal = expenseArray.reduce((a, b) => a + b, 0);
            let incomeTotal = incomeArray.reduce((a,b) => a + b, 0);
            let difference = incomeTotal - expenseTotal

            fb.db.collection('BudgetOverview').doc('Overview').set({
                'expenseTotal': expenseTotal,
                'incomeTotal': incomeTotal,
                'start': start,
                'end': end,
                'difference': difference
            })
        },
        clearData() {
            let state = this.budgetLine;
            state.amount = '',
            state.name = '',
            state.budgetType = '',
            state.expenseType = ''
        }
    },
    filters: {
        formatDate(val) {
            let date = moment(val).format('MMM Do, YYYY')
            return date
        },
        formatCurrency(val) {
            let value = numeral(val).format('$0,0')
            return value
        }
    }
}
</script>

