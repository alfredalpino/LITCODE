type ApiPath = `/api/${string}`;
function go(path: ApiPath) {
  console.log(path);
}
go("/api/users");
export {};
