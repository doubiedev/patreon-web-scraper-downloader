import type { State } from "./state";

export async function commandHelp(state: State) {
    console.log("Usage: ");
    console.log();

    for (const cmd of Object.values(state.commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
    console.log();
};

