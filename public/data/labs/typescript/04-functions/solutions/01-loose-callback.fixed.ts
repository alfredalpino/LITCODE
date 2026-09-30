type ZeroArg = () => void;
function runTwice(fn: ZeroArg) { fn(); fn(); }
runTwice(() => console.log("ok"));
export {};
