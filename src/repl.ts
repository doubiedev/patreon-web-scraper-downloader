import type { State } from "./state";

export async function startREPL(state: State) {
    console.log("Welcome to the Patreon Scraper REPL!");
    console.log("Type 'help' for a list of commands.");

    state.readline.prompt();

    state.readline.on("line", async (input) => {
        const words = cleanInput(input);

        if (words.length === 0) {
            state.readline.prompt();
            return
        }

        const commandName = words[0];
        const cmd = state.commands[commandName];

        if (!cmd) {
            console.log(
                `Unknown command: "${commandName}". Type "help" for a list of commands.`,
            );
            state.readline.prompt();
            return;
        }

        try {
            await cmd.callback(state, ...words);
        } catch (e) {
            console.log(e);
        }

        state.readline.prompt()
    });
}

export function cleanInput(input: string): string[] {
    const strings = input.toLowerCase().split(" ")
    const out = [];
    for (let i = 0; i < strings.length; ++i) {
        if (strings[i].replaceAll(" ", "") !== "") {
            out.push(strings[i])
        }
    }

    return out;
}
