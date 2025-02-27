import "dotenv/config";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs"; // Use promise-based API
import { existsSync, writeFileSync, readFileSync } from "fs"; // Import specific functions
import path from "path";
import os from "os";

const platform = process.platform;

function getConfigPath() {
  const configDirs = {
    win32: path.join(
      process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
      "note-js"
    ),
    linux: path.join(os.homedir(), ".config"),
    darwin: path.join(os.homedir(), ".notes-js"),
  };

  const configFiles = {
    win32: "config.json",
    linux: ".note-js.config.json",
    darwin: ".config.json",
  };

  if (!configDirs[platform]) {
    throw new Error("Unsupported platform");
  }

  const dirPath = configDirs[platform];
  const configPath = path.join(dirPath, configFiles[platform]);

  // Create directory if it doesn't exist
  if (!existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return configPath;
}

const configPath = getConfigPath();
const commonEditors = ["nano", "vim", "code", "gedit", "notepad"];

function isEditorAvailable(editor) {
  try {
    const command =
      platform === "win32" ? `where ${editor}` : `command -v ${editor}`;
    execSync(command, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function loadEditorPreference() {
  try {
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      return config?.editor || null;
    }
    return null;
  } catch (error) {
    console.log("Error reading config file, resetting preference");
    return null;
  }
}

function saveEditorPreference(editor) {
  writeFileSync(configPath, JSON.stringify({ editor }, null, 2), "utf-8");
}

async function chooseEditor() {
  // Check available editors once and store the result
  const availableEditors = commonEditors.filter(isEditorAvailable);
  let editorChoices = [...availableEditors, "custom"];

  if (editorChoices.length === 1) {
    console.log(
      "No known editors detected. Please enter your preferred editor"
    );
    editorChoices = ["custom"];
  }

  const { chosenEditor } = await inquirer.prompt([
    {
      type: "list",
      name: "chosenEditor",
      message: "Choose an editor",
      choices: editorChoices,
    },
  ]);

  let editor = chosenEditor;
  if (editor === "custom") {
    const { customEditor } = await inquirer.prompt([
      {
        type: "input",
        name: "customEditor",
        message: "Enter the name of your preferred editor",
      },
    ]);
    editor = customEditor;
  }

  saveEditorPreference(editor);
  return editor;
}

async function menu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Write a journal entry", "Edit your preferred editor", "exit"],
    },
  ]);

  switch (action) {
    case "Write a journal entry":
      return true;
    case "Edit your preferred editor":
      await chooseEditor();
      break;
    case "exit":
      process.exit(0);
  }

  return menu(); // Return the result of the recursive call
}

async function main() {
  console.log(loadEditorPreference());
  // Uncomment these lines for testing
  // const editor = await chooseEditor();
  // console.log(editor);
  // console.log(loadEditorPreference());
  menu();
}

main();
