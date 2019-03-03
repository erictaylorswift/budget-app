<template>
  <div class="tile is-child">
    <h2 class="subtitle">Totals by day</h2>
    <v-table :data="expensesByDay" class="table is-bordered is-fullwidth">
      <thead slot="head">
        <v-th sortKey="date" defaultSort="asc">Date</v-th>
        <th>Total Expenses</th>
      </thead>
      <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="row in displayData" :key="row.id">
          <td>{{row.date | formatDate}}</td>
          <td>{{row.expenseTotal | formatCurrency}}</td>
        </tr>
        <tr class="is-selected">
          <td></td>
          <td class="has-text-weight-bold has-text-grey-dark">{{totalExpenses | formatCurrency}}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>


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