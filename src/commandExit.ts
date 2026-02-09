import type { State } from "./state";

export async function commandExit(state: State) {
    console.log("Closing...");
    state.readline.close();
    process.exit(0);
};
