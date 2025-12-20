'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2025-12-15T17:01:17.194Z',
    '2025-12-16T23:36:17.929Z',
    '2025-12-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-11-17T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-11-15T18:49:59.371Z',
    '2025-11-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const formatMovementDate = function (date, locale) {
  const calcDatePassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDatePassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0)
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0)
  //   const year = date.getFullYear();

  //   return `${day} / ${month} / ${year}`
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';

  movs.forEach((mov, i) => {
    const type = mov < 0 ? 'withdrawal' : 'deposit';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcSummaryDispaly = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(outcomes, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}: ${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer)
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to get started';
    }

    // Decrease 1 second
    time--;
  };
  // Set Timer to 5 minutes
  let time = 120;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer
};

let currentAccount, timer;

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display Balance
  calcBalanceDisplay(acc);

  //Display summary
  calcSummaryDispaly(acc);
};

///FAKE LOGIN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

///Intertionalizing

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('correct pin');
    containerApp.style.opacity = 100;

    // Display Welcome
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    ///Create Date
    // const now = new Date();

    //   const day = `${now.getDate()}`.padStart(2, 0)
    //   const month = `${now.getMonth() + 1}`.padStart(2, 0)
    //   const year = now.getFullYear();
    //   const hour = `${now.getHours()}`.padStart(2, 0);
    //   const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day} / ${month} / ${year}, ${hour} : ${min}`

    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long'
    };

    // const locale = navigator.language

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    inputLoginPin.blur();
    inputLoginUsername.value = inputLoginPin.value = '';

    if(timer) clearInterval(timer)
    timer = startLogOutTimer();

    // update ui
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  //
  e.preventDefault();

  const amount = inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username &&
    amount <= currentAccount.balance
  ) {
    receiverAcc.movements.push(+amount);
    currentAccount.movements.push(-amount);

    // Create transfer Date

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // update ui
    updateUI(currentAccount);

    inputTransferTo.value = inputTransferAmount.value = '';
  }

  console.log(amount, receiverAcc);

  //Reset timer
  clearInterval(timer)
  timer = startLogOutTimer()      
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Update Movements
      currentAccount.movements.push(amount);

      // Loan Transfer
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    inputLoanAmount.value = '';
  }

  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  //
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, sorted);

  sorted = !sorted;
});

// console.log(movements)

// includes test for equality
// console.log(movements.includes(-130))

// some test for condition
const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits)

// every returns true only if all the element meet the condition
// console.log(movements.every(mov => mov > 0))

//Seperate Callback function for methods

const deposit = mov => mov > 0;

// console.log(movements.some(deposit))
// console.log(movements.every(deposit))
// console.log(movements.filter(deposit))
// console.log(movements.find(deposit))

const arr = [[1, 2, 3], 4, 5, [6, 7, 8]];
// console.log(arr.flat())
const arrDeep = [[1, [2, 3]], 4, 5, [6, [7, 8]]];
// console.log(arrDeep.flat(2)) // flat goes deeper by 2 eince the nested array also goes deeper

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance)

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance2)

const arr2 = ['Jonas', 'Tola', 'Ade'];

// console.log(arr2.sort()) //sort method mutates the original array and this sort alphabetically, ao using it kn number will mot sort numerically, instead it sort alphabetically from 1,2 to 3 and go on

// console.log(arr2)

// To sort Numerically: it receives two parameters e.g (a, b) where a and b are two consecutive numbers in the array.
// Now the sort takes a callback function which has to return a condition:
// if you return < 0 (i.e negative), the a comes before b
// if you return > 0 (i.e positive), b comes before a
const sortedMovement = movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

// 400, -450

// console.log(sortedMovement)

const newOwner = [700, 800, -600, 3000, -900];

// const sortedOwner = newOwner.sort((a,b)=> {
//   if (a > b) return 1
//   if (a < b) return -1
// })

const sortedOwner = newOwner.slice().sort((a, b) => a - b); // Ascending Order

const sortedOwner2 = newOwner.slice().sort((a, b) => b - a); // Descending Order

// console.log(sortedOwner,sortedOwner2)

// In sorting: negative to retain, positive to flip

///Format of Creating Array

const x = new Array(7);

x.fill('hello', 2, 6); // first parameter is the element to be filled in, second os the starting position, third is the finishing point
// console.log(x)

const y = Array.from({ length: 7 }, () => 1);
// console.log(y)
const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z)

// const diceRoll = Array.from({length: 100}, (cur, i) => {
//   return i + 1
// })

// // console.log(diceRoll)

// Array.from() can be used to turn iterables like string, Map ans Set to array
// Also, we can use it to turn NodeList from .queryselectorAll to array and by that we can use map and other method on it method

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value', el =>
      Number(el.textContent.replace('€', ''))
    )
  );

  // // console.log(movementsUI)
});

///////////////////////////////////////)/////////NUMBER, DATES

/*
// console.log(23 === 23.0)


//To convert to Number
// console.log(Number('20'))
// console.log(+'20')

//Parsing 
// console.log(Number.parseInt('30px', 10)) // only return the integer, the second argument represent the number base
//indicate thr number base to avoid some bugs
// console.log(Number.parseInt('e23', 10)) // won't work because letter comes before number 

// console.log(Number.parseInt('2.5rem')) // Also removes the decimal

//To retain the decimal

// console.log(Number.parseFloat('2.5rem')) // best to check for float



// To check if a number is NaN - Weird ❌
// console.log(Number.isNaN(20))
// console.log(Number.isNaN('20'))
// console.log(Number.isNaN(+'20x'))
// console.log(Number.isNaN(20/0))

// best to use to check if sth is a number 
// console.log(Number.isFinite(20))
// console.log(Number.isFinite('20'))
// console.log(Number.isFinite(+'20x'))
// console.log(Number.isFinite(20 / 0))

// console.log(Number.isInteger(20))
// console.log(Number.isInteger('20'))

*/

// console.log(Math.sqrt(25)) // square root
// console.log(25 ** (1/2)) // square root
// console.log(8 ** (1/3)) // cube root

// console.log(Math.max(5,23,5,6,78,9))
// console.log(Math.min(5,23,5,6,78,9))

// //to calculate area of a circle
// console.log(Math.PI * Number.parseFloat('10px') ** 2)

// console.log(Math.trunc(Math.random() * 6) + 1)

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min

// console.log(randomInt(10, 20))

// //Rounding Integers

// console.log(Math.trunc(23.3))

// // to nearest whole num
// console.log(Math.round(23.3))
// console.log(Math.round(23.9))

// console.log(Math.floor(23.3))
// console.log(Math.floor(23.9))

// console.log(Math.ceil(23.3))
// console.log(Math.ceil(23.9))

// console.log(Math.trunc(-23.3)) // only cutoff the decimal part
// console.log(Math.floor(-23.3)) // round down to the nearest num

// // Rounding Decimals

// // toFixed return string
// console.log((2.7).toFixed(0))
// console.log((2.7).toFixed(3))
// console.log((2.345).toFixed(2)) // to 2 decimal places
// console.log(+(2.7).toFixed(0))

//Remainder Operator : can be used for every nth

// console.log(8 % 3)
// console.log(5 % 2)

// const isEven = n => n%2 === 0;
// console.log(isEven(8))
// console.log(isEven(23))
// console.log(isEven(514))

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered'
//     if (i % 3 === 0) row.style.backgroundColor = 'blue'
//   })
// }
// )

// Create Date

// const now = new Date()
// console.log(now)
// console.log(new Date (account1.movementsDates[0]))

// const future = (new Date(2037, 10, 19, 15, 23))

// console.log(future)

// console.log(future.getFullYear())
// console.log(future.getMonth())
// console.log(future.getDate())
// console.log(future.getDay())
// console.log(future.getHours())
// console.log(future.getMinutes())
// console.log(future.toISOString())
// console.log(future.getTime()) // millisecond that has passed

// console.log(Date.now()) // To get timelapse of current date i.e millisecond that has passed
// future.setFullYear(2050)
// console.log(future)

const calcDatePassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const day1 = calcDatePassed(new Date(2026, 1, 14), new Date(2025, 11, 18));

// console.log(day1);

// const num = 3884764.23;

// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'NGN',
//   // useGrouping: false
// };

// console.log('US:    ', new Intl.NumberFormat('en-NG', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );
// console.log('ar-SY: ', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('de-DE: ', new Intl.NumberFormat('de-DE', options).format(num));

const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your pizza made with ${ing1} and ${ing2}`);
  },
  3000,
  ...ingredients
);

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//SetInterval

setInterval(() => {
  const nowHours = new Date().getHours();

  const nowMinutes = new Date().getMinutes();

  const nowSeconds = `${new Date().getSeconds()}`.padStart(2, 0);
  console.log(`${nowHours}:${nowMinutes}:${nowSeconds}`);
}, 1000);
