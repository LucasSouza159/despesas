const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionAmount = document.querySelector("#amount");
const inputTransactionName = document.querySelector("#text");


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));
let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction =>
            transaction.id !== ID);
    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `;
    transactionsUl.prepend(li);
}

const getExpenses = transactionAmount => Math.abs(transactionAmount
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);

const getIncome = transactionAmount => transactionAmount
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = transactionAmount => transactionAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);





const updateBalanceValues = () => {
    const transactionAmount = transactions.map(({ amount }) => amount);
    const total = getTotal(transactionAmount);
    const income = getIncome(transactionAmount);
    const expense = getExpenses(transactionAmount);

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}
init();

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateId = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionAmount = inputTransactionAmount.value.trim();
    const transactionName = inputTransactionName.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        alert("Por favor, preencha tanto o nome quanto o valor da transação!");
        return
    }
    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();

};
form.addEventListener("submit", handleFormSubmit);