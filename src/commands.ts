import { commandExit } from "./commandExit";
import { commandHelp } from "./commandHelp";

import type { CLICommand } from "./state";

export function getCommands(): Record<string, CLICommand> {
    return {
        exit: {
            name: "exit",
            description: "Exits the scraper",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
    };
}

