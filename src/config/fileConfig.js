import fs from "fs";
import path from "path";
import { configDirs, CONFIG_FILE } from "../utils/config-helper.js";

export function getConfigPath(platform) {
  if (!configDirs[platform]) {
    throw new Error("Unsupported platform");
  }

  const dirPath = configDirs[platform];
  const configPath = path.join(dirPath, CONFIG_FILE);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return configPath;
}

export function isConfigEmpty(configPath) {
  try {
    if (!fs.existsSync(configPath)) return true;
    const content = fs.readFileSync(configPath, "utf-8").trim();
    if (content === "") return true;
    const config = JSON.parse(content);
    if (Object.keys(config).length === 0) return true;
    return false;
  } catch (error) {
    console.log("Error reading config file, resetting preference");
    return true;
  }
}
