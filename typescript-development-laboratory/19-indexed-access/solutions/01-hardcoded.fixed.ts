type User = { id: string; role: "admin" | "user" };
function setRole(role: User["role"]) {
  console.log(role);
}
setRole("admin");
export {};
