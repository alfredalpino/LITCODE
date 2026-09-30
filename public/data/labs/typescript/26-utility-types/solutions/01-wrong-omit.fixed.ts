type User = { id: string; password: string };
type PublicUser = Omit<User, "password">;
function toPublic(u: User): PublicUser {
  const { password: _p, ...pub } = u;
  return pub;
}
console.log(toPublic({ id: "1", password: "secret" }));
export {};
