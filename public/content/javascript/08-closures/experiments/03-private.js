// 08-closures / 03-private.js
"use strict";

function bankAccount(opening) {
  let balance = opening;
  return {
    deposit(n) {
      balance += n;
      return balance;
    },
    withdraw(n) {
      if (n > balance) throw new Error("insufficient");
      balance -= n;
      return balance;
    },
    // no direct balance export
  };
}

const acct = bankAccount(100);
console.log(acct.deposit(20));
console.log(acct.withdraw(50));
console.log("balance" in acct, acct.balance);
