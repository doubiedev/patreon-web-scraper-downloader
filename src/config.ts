import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline/promises";

const configSchema = {
    creator: "string",
    numPostsToScrape: "number",
    scrapeByYear: "boolean",
    scrapeComments: "boolean",
    scrapeReplies: "boolean",
} as const;

export type Config = {
    [K in keyof typeof configSchema]:
    typeof configSchema[K] extends "string" ? string :
    typeof configSchema[K] extends "number" ? number :
    boolean;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BASE_DIR = path.resolve(__dirname, "..");

function getBaseDir(): string {
    const override = process.env.CONFIG_DIR;

    if (override && override.trim() !== "") {
        return path.resolve(override);
    }

    return DEFAULT_BASE_DIR;
}

function getConfigFilePath(): string {
    return path.join(getBaseDir(), ".config.json");
}

export function readConfig(): Config {
    const fullPath = getConfigFilePath();

    const data = fs.readFileSync(fullPath, "utf-8");
    try {
        const rawConfig = JSON.parse(data);
        return validateConfig(rawConfig);
    } catch (err) {
        throw err;
    }
}

function validateConfig(rawConfig: unknown): Config {
    if (typeof rawConfig !== "object" || rawConfig === null) {
        throw new Error("Config must be an object");
    }

    const cfg = rawConfig as Record<string, unknown>;

    for (const [key, expectedType] of Object.entries(configSchema)) {
        if (!(key in cfg)) {
            throw new Error(`${key} is required in config file`);
        }

        if (typeof cfg[key] !== expectedType) {
            throw new Error(
                `${key} must be of type ${expectedType}, got ${typeof cfg[key]}`
            );
        }
    }

    return cfg as Config;
}

function writeConfig(config: Config): void {
    const fullPath = getConfigFilePath();

    const rawConfig: Config = {
        creator: config.creator,
        numPostsToScrape: config.numPostsToScrape,
        scrapeByYear: config.scrapeByYear,
        scrapeComments: config.scrapeComments,
        scrapeReplies: config.scrapeReplies,
    };

    const data = JSON.stringify(rawConfig, null, 2);
    fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}

export function updateConfig(options: Partial<Config>): void {
    const config = readConfig();
    const newConfig = { ...config, ...options } as Config;
    writeConfig(newConfig);
}

export function configExists(): boolean {
    return fs.existsSync(getConfigFilePath());
}

async function createConfig(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function askYesNo(question: string, defaultToYes: boolean): Promise<boolean> {
        while (true) {
            const answer = (await rl.question(question)).trim().toLowerCase();

            if (answer === "y" || answer === "yes") return true;
            if (answer === "n" || answer === "no") return false;
            if (answer === "") return defaultToYes;

            console.log("Please enter 'y' or 'n'.");
        }
    }

    async function askQuestion(question: string): Promise<string> {
        const answer = (await rl.question(question)).trim();
        return answer;
    }

    function displayCommands(): void {
        console.log("");
        console.log("Commands:");
        console.log("(1) Show Config");
        console.log("(2) Update Config");
        console.log("(3) Create New Config");
        console.log("(4) Exit");
        console.log("");
    }

    while (true) {
        displayCommands();
        const choice = await askQuestion("> ");

        switch (choice) {
            case "1":
                console.log("");
                if (!configExists()) {
                    console.log("No config found.");
                    break;
                }
                try {
                    const config = readConfig();
                    console.log("===CONFIG===");
                    console.log("Creator: ", config.creator);
                    console.log("Number of posts to scrape: ", config.numPostsToScrape);
                    console.log("Scrape by year: ", config.scrapeByYear);
                    console.log("Scrape comments: ", config.scrapeComments);
                    console.log("Scrape replies: ", config.scrapeReplies);
                    console.log("");
                    break;
                } catch (err) {
                    console.error("Error reading config file:", err);
                    break;
                }
            case "2":
                console.log("");
                if (!configExists()) {
                    console.log("No config found.");
                    break;
                }
                try {
                    const config = readConfig();
                    console.log("Leave empty to use the config's <original value>.");

                    let confirmUpdatedConfig = false;
                    while (confirmUpdatedConfig === false) {
                        console.log("");
                        const creator = await askQuestion(`Creator username <${config.creator}>: `);

                        let numPostsToScrape;
                        while (true) {
                            numPostsToScrape = await askQuestion(`Number of posts to scrape <${config.numPostsToScrape}>: `);
                            if (parseInt(numPostsToScrape) > 0 || numPostsToScrape === "") {
                                break;
                            } else {
                                console.log("Please enter a positive integer.");
                            }
                        }

                        const scrapeByYear = await askYesNo(`Scrape by year <${config.scrapeByYear}> (y/n): `, config.scrapeByYear);
                        const scrapeComments = await askYesNo(`Scrape comments <${config.scrapeComments}> (y/n): `, config.scrapeComments);
                        const scrapeReplies = await askYesNo(`Scrape replies <${config.scrapeReplies}> (y/n): `, config.scrapeReplies);

                        const updatedConfig: Config = {
                            creator: creator === "" ? config.creator : creator,
                            numPostsToScrape: numPostsToScrape === "" ? config.numPostsToScrape : parseInt(numPostsToScrape),
                            scrapeByYear: scrapeByYear,
                            scrapeComments: scrapeComments,
                            scrapeReplies: scrapeReplies,
                        }

                        console.log("");
                        console.log("===UPDATED CONFIG===");
                        console.log("Creator: ", updatedConfig.creator);
                        console.log("Number of posts to scrape: ", updatedConfig.numPostsToScrape);
                        console.log("Scrape by year: ", updatedConfig.scrapeByYear);
                        console.log("Scrape comments: ", updatedConfig.scrapeComments);
                        console.log("Scrape replies: ", updatedConfig.scrapeReplies);
                        console.log("");

                        confirmUpdatedConfig = await askYesNo("Confirm updated config details? (Y/n): ", true);

                        if (confirmUpdatedConfig) {
                            writeConfig(updatedConfig);
                        }
                    }
                    break;
                } catch (err) {
                    console.error("Error reading config file:", err);
                    break;
                }
            case "3":
                if (!configExists()) {
                    console.log("No config found.");
                    break;
                }
                try {
                    const config = readConfig();

                    let confirmNewConfig = false;
                    while (confirmNewConfig === false) {
                        console.log("");
                        const creator = await askQuestion(`Creator username: `);

                        let numPostsToScrape;
                        while (true) {
                            numPostsToScrape = await askQuestion(`Number of posts to scrape: `);
                            if (parseInt(numPostsToScrape) > 0) {
                                break;
                            } else {
                                console.error("Please enter a positive integer.");
                            }
                        }

                        const scrapeByYear = await askYesNo(`Scrape by year (Y/n): `, true);
                        const scrapeComments = await askYesNo(`Scrape comments (Y/n): `, true);
                        const scrapeReplies = await askYesNo(`Scrape replies (Y/n): `, true);

                        const newConfig: Config = {
                            creator: creator === "" ? config.creator : creator,
                            numPostsToScrape: parseInt(numPostsToScrape),
                            scrapeByYear: scrapeByYear,
                            scrapeComments: scrapeComments,
                            scrapeReplies: scrapeReplies,
                        }

                        console.log("");
                        console.log("===NEW CONFIG===");
                        console.log("Creator: ", newConfig.creator);
                        console.log("Number of posts to scrape: ", newConfig.numPostsToScrape);
                        console.log("Scrape by year: ", newConfig.scrapeByYear);
                        console.log("Scrape comments: ", newConfig.scrapeComments);
                        console.log("Scrape replies: ", newConfig.scrapeReplies);
                        console.log("");

                        confirmNewConfig = await askYesNo("Confirm new config details? (Y/n): ", true);

                        if (confirmNewConfig) {
                            writeConfig(newConfig);
                        }
                    }
                    break;
                } catch (err) {
                    console.error("Error reading config file:", err);
                    break;
                }
            default:
                console.log("");
                break;
        }

        if (choice === "4") {
            break;
        }
    }

    rl.close()
}

createConfig();
