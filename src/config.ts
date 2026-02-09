import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

export function createConfig(config: Config): void {
    writeConfig(config);
}

export function updateConfig(options: Partial<Config>): void {
    const config = readConfig();
    const newConfig = { ...config, ...options } as Config;
    writeConfig(newConfig);
}
