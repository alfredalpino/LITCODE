/**
 * Sample refactor for any-bug — write yours first.
 */

type Product = { name: string; price: number };

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "price" in value &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).price === "number"
  );
}

function applyTax(product: unknown): string {
  if (!isProduct(product)) {
    throw new Error("Invalid product");
  }
  return product.price.toFixed(2);
}

const good = { name: "Tea", price: 3 };
const bad = { name: "Hack", price: "3.00" };

console.log(applyTax(good));
try {
  console.log(applyTax(bad));
} catch (e) {
  console.log("caught:", e instanceof Error ? e.message : e);
}

export {};
