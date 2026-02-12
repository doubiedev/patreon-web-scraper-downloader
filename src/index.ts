import { readConfig } from "./config";

function main() {
    // TODO: check config file exists
    // config doesnt exists, would you like to create one now?
    // if yes, prompt user for config details

    try {
        readConfig();
    } catch (err) {
        console.error("Config file does not exist, please create one with 'npm run config'.");
    }

}

main();
