import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

import {
    readConfig,
    createConfig,
    updateConfig,
    type Config,
} from "./config";

let tempDir: string;

const baseConfig: Config = {
    creator: "sanguinius",
    numPostsToScrape: 10,
    scrapeByYear: true,
    scrapeComments: false,
    scrapeReplies: true,
};

beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-test-"));
    process.env.CONFIG_DIR = tempDir;
});

afterEach(() => {
    delete process.env.CONFIG_DIR;
    fs.rmSync(tempDir, { recursive: true, force: true });
});

// Create Config
it("creates a config file in the overridden config directory", () => {
    createConfig(baseConfig);

    const filePath = path.join(tempDir, ".config.json");
    expect(fs.existsSync(filePath)).toBe(true);

    const contents = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    expect(contents).toEqual(baseConfig);
});

// Read Config
it("reads an existing config file", () => {
    fs.writeFileSync(
        path.join(tempDir, ".config.json"),
        JSON.stringify(baseConfig)
    );

    const result = readConfig();
    expect(result).toEqual(baseConfig);
});

// Invalid JSON
it("throws if the config file contains invalid JSON", () => {
    fs.writeFileSync(
        path.join(tempDir, ".config.json"),
        "{ invalid json"
    );

    expect(() => readConfig()).toThrow();
});

// Missing required fields
it("throws if a required key is missing", () => {
    const badConfig = {
        creator: "horus",
        scrapeByYear: true,
        scrapeComments: false,
        scrapeReplies: true,
    };

    fs.writeFileSync(
        path.join(tempDir, ".config.json"),
        JSON.stringify(badConfig)
    );

    expect(() => readConfig()).toThrow(
        "numPostsToScrape is required in config file"
    );
});

// Wrong type
it("throws if a config value has the wrong type", () => {
    const badConfig = {
        ...baseConfig,
        numPostsToScrape: "ten",
    };

    fs.writeFileSync(
        path.join(tempDir, ".config.json"),
        JSON.stringify(badConfig)
    );

    expect(() => readConfig()).toThrow(
        "numPostsToScrape must be of type number"
    );
});

// Update Config
it("updates an existing config file", () => {
    fs.writeFileSync(
        path.join(tempDir, ".config.json"),
        JSON.stringify(baseConfig)
    );

    updateConfig({ scrapeComments: true });

    const updated = JSON.parse(
        fs.readFileSync(path.join(tempDir, ".config.json"), "utf-8")
    );

    expect(updated.scrapeComments).toBe(true);
    expect(updated.creator).toBe("sanguinius");
});

