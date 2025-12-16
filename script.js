'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    let username = acc.owner.toLowerCase().split(' ');
    username = username.map(eachName => eachName[0]);
    acc.username = username.join('');
  });
};

createUsernames(accounts);

const calcBalanceDisplay = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  
  labelBalance.textContent = `${acc.balance}€`
  
};


const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcSummaryDispaly = function (acc) {
  
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov)=> acc + mov, 0)
  
  labelSumIn.textContent=`${incomes}€`

const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc,mov)=> acc + mov, 0)
labelSumOut.textContent=`${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * 1.2 / 100).filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent=`${interest}€`
};

let currentAccount;
const updateUI = function (acc) {
      //Display movements
    displayMovements(acc.movements);

    //Display Balance
    calcBalanceDisplay(acc);

    //Display summary
    calcSummaryDispaly(acc);
}


btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('correct pin');
    containerApp.style.opacity = 100;

    // Display Welcome
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;


// update ui
updateUI(currentAccount);

inputLoginUsername.value = inputLoginPin.value = '';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  
  const amount = inputTransferAmount.value
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  
  if(amount > 0 && receiverAcc && receiverAcc.username !== currentAccount.username && amount <= currentAccount.balance){
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount)
    
// update ui
updateUI(currentAccount);

inputTransferTo.value = inputTransferAmount.value =''
  }
  
  console.log(amount, receiverAcc)
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  
  const amount = Number(inputLoanAmount.value);
  
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount* 0.1)) {
    //Update Movements 
    currentAccount.movements.push(amount)
    // Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = ''
  }
  
  
})


btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  
  
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    
    
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    
   console.log(index) 
   accounts.splice(index, 1)
  containerApp.style.opacity = 0;
  
  }
  
  inputClosePin.value = inputCloseUsername.value =''

})

console.log(movements)


// includes test for equality 
console.log(movements.includes(-130))

// some test for condition
const anyDeposits = movements.some(mov => mov > 0)
console.log(anyDeposits)

// every returns true only if all the element meet the condition 
console.log(movements.every(mov => mov > 0))
console.log(account4.movements.every(mov => mov > 0))


//Seperate Callback function for methods

const deposit = mov => mov > 0

console.log(movements.some(deposit))
console.log(movements.every(deposit))
console.log(movements.filter(deposit))
console.log(movements.find(deposit))


const arr = [[1,2,3],4,5,[6,7,8]]
console.log(arr.flat())
const arrDeep = [[1,[2,3]],4,5,[6,[7,8]]]
console.log(arrDeep.flat(2)) // flat goes deeper by 2 eince the nested array also goes deeper 



const overallBalance = accounts.map(
  acc => acc.movements
).flat().reduce((acc, mov) => acc + mov, 0)

console.log(overallBalance)

const overallBalance2 = accounts.flatMap(
  acc => acc.movements
).reduce((acc, mov) => acc + mov, 0)

console.log(overallBalance2)

