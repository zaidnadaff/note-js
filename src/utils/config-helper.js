import path from "path";
import os from "os";
export const configDirs = {
  win32: path.join(
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
    "note-js"
  ),
  linux: path.join(os.homedir(), ".config", ".notes-js"),
  darwin: path.join(os.homedir(), ".notes-js"),
};

export const CONFIG_FILE = ".config.json";
