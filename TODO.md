# IN PROGRESS
- [ ] REPL
    - [ ] can pass `--config-dir <path_to_config>`
    - [ ] check for config, if no config, "no config detected, please create one now" (run config command)
        - Use existing config directory (default/custom: `<dir_path>` ) (Y/n)? // show dynamically curr config type and path
            - If no, prompt for location of config, set this in the .env.
        - If no config: "no config detected in selected directory, please create one now:", prompt user input to create config
        - Set config options, then print config and ask if user is happy with the config
    - [ ] Commands:
        - config

# TODO


# BACKLOG
- [ ] Add maxDisplayedPosts to config which will help with low memory pcs when loading a large amount of posts from a creator in a particular year

# DONE
- [x] Read puppeteer-web-scraper code, figure it out how it works more or less
- [x] Do the actions on patreon manually, make a flow diagram based on this for what the program should do
    - Flow Diagram:
        - Open browser
        - navigate to creator's patreon web page
        - open filters
        - loop over filters: select and apply by year
        - loop over "load more" until every post is loaded
        - if scrape comments: load & save comments
        - if scrape replies: load & save replies
        - save webpage as mhtml for each year
    - NOTE: If I save the document, delete current loaded posts, and load some more posts, I may be able to avoid the memory problems.
- [x] Config options:
    - creator name
    - scrape by - year, month
    - num posts to scrape
    - scrape comments
    - scrape replies
- [x] Add config tests
- [x] Login script - opens bowser to patreon login page, 
