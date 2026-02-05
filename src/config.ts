import fs from "fs";
import path from "path";

// export type Config = {
//     creator: string,
//     scrapeByYear: boolean,
//     numPostsToScrape: number,
//     scrapeComments: boolean,
//     scrapeReplies: boolean,
// };

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

function getConfigFilePath(): string {
    const configFileName = ".config.json";
    const rootDir = path.resolve(import.meta.dirname, "..");

    return path.join(rootDir, configFileName);
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

    // NOTE: might not need to set this if i'm giving it a good config to begin with
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
    // NOTE: might need to double check this actually is a config here
    const newConfig = { ...config, ...options } as Config;
    writeConfig(newConfig);
}
