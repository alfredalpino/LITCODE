type Payload = { user: { id: string } };
function send(p: Payload) {
  console.log(p.user.id);
}
send({ user: { id: "1" } });
export {};
