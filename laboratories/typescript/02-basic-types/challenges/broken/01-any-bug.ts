/**
 * Bug hidden by any — refactor to unknown + narrowing
 *
 * Symptom: runtime crash when price is a string.
 * Your job: make the unsafe call a type error OR handle string prices safely.
 * Ban: leaving `any` on `product`.
 */

type Product = { name: string; price: number };

function applyTax(product: any) {
  return product.price.toFixed(2);
}

const good = { name: "Tea", price: 3 };
const bad = { name: "Hack", price: "3.00" };

console.log(applyTax(good));
console.log(applyTax(bad)); // runtime boom

export {};
