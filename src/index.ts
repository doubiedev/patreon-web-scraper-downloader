import { configExists, readConfig, type Config } from "./config.js";

function main() {
    const cfg = getConfig();
}

function getConfig(): Config {
    if (!configExists()) {
        console.error("No config found. Please create a config first with 'npm run config'.");
        process.exit(1);
    }

    try {
        const config = readConfig();
        return config;
    } catch (err) {
        console.error("Error reading config file:", err);
        process.exit(1);
    }
}

main();
