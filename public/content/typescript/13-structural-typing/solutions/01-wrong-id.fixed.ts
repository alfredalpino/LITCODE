type UserId = string & { __brand: "UserId" };
type OrderId = string & { __brand: "OrderId" };
function refund(orderId: OrderId, userId: UserId) {
  console.log(orderId, userId);
}
const userId = "u1" as UserId;
const orderId = "o9" as OrderId;
refund(orderId, userId);
export {};
