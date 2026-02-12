import { type Config, createConfig, readConfig, updateConfig } from './config';

function main() {
    const firstConfig: Config = {
        creator: "johndoe",
        numPostsToScrape: 90,
        scrapeByYear: true,
        scrapeComments: true,
        scrapeReplies: true,
    }

    const updatedConfig: Partial<Config> = {
        creator: 'updatedcreator',
    }

    console.log("writing first config...");
    createConfig(firstConfig);
    console.log("reading first config...");
    console.log("config:", readConfig());
    console.log("updating config...");
    updateConfig(updatedConfig);
    console.log("reading updated config...");
    console.log("config:", readConfig());
}

main();
