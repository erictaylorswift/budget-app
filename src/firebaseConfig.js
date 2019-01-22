import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCJaSjyTZITHVhdUSHn9JPeGIYHUBNYS84",
    authDomain: "expense-budget.firebaseapp.com",
    databaseURL: "https://expense-budget.firebaseio.com",
    projectId: "expense-budget",
    storageBucket: "expense-budget.appspot.com",
    messagingSenderId: "837103426755"
}

firebase.initializeApp(config)

const db = firebase.firestore()
const auth = firebase.auth()
const budgetCollection = db.collection('Budget')
const expenseCollection = db.collection('Expenses')
const incomeCollection = db.collection('Income')

export {
    db,
    auth,
    budgetCollection,
    expenseCollection,
    incomeCollection
}