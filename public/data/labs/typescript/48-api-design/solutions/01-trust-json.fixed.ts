type UserDTO = { id: string; name: string };
function parseUser(raw: unknown): UserDTO | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.name !== "string") return null;
  return { id: r.id, name: r.name };
}
function load(json: string): UserDTO | null {
  try {
    return parseUser(JSON.parse(json));
  } catch {
    return null;
  }
}
console.log(load('{"id":"1","name":"Ada"}'), load('{"id":1}'));
export {};
