import { initState } from "./state";
import { startREPL } from "./repl";

async function main() {
    const state = initState();
    await startREPL(state);
}

main();
