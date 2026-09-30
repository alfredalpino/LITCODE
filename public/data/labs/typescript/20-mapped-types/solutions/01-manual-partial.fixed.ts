type User = { id: string; name: string; email: string };
type UserPatch = { [K in keyof User]?: User[K] };
const p: UserPatch = { email: "a@b.co" };
console.log(p);
export {};
