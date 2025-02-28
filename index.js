#!/usr/bin/env node
import { getConfigPath, isConfigEmpty } from "./src/config/fileConfig.js";
import { loadUserName } from "./src/config/userDetails.js";
import { initializer } from "./src/initializeUser.js";
import { showMainMenu } from "./src/mainMenu.js";

const platform = process.platform;
const configpath = getConfigPath(platform);

if (isConfigEmpty(configpath)) {
  await initializer(configpath);
}

const userName = loadUserName(configpath);

showMainMenu(configpath, userName);
