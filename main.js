import { getConfigPath, isConfigEmpty } from "./src/config/fileConfig.js";
import { initializer } from "./src/initializeUser.js";

const platform = process.platform;
const configpath = getConfigPath(platform);
if (isConfigEmpty(configpath)) {
  initializer(configpath);
}
