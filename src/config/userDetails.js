import inquirer from "inquirer";
import { getAvailableEditors } from "../utils/editors.js";
import chalk from "chalk";
import fs from "fs";
import { getConfigPath } from "./fileConfig.js";

export async function getUserName(configPath) {
  const { userName } = await inquirer.prompt([
    {
      type: "input",
      name: "userName",
      message: "So, what do I call you?",
    },
  ]);
  saveUserName(userName, configPath);
  console.log(chalk.blue.bold(`Hello ${userName}, Nice to meet you!`));
}

export async function getEditorPreference(configPath) {
  if (!configPath) {
    configPath = getConfigPath(process.platform);
  }
  let editorChoices = getAvailableEditors();
  if (editorChoices.length === 1) {
    console.log("No known editors detected! You must enter one manually.");
    editorChoices = ["custom"];
  }

  const { chosenEditor } = await inquirer.prompt([
    {
      type: "list",
      name: "chosenEditor",
      message: "Select your preferred text editor:",
      choices: editorChoices,
    },
  ]);

  let editor = chosenEditor;

  if (chosenEditor === "custom") {
    const { customEditor } = await inquirer.prompt([
      {
        type: "input",
        name: "customEditor",
        message:
          "Enter the command for your preferred editor (e.g., nano, vim, code):",
      },
    ]);
    editor = customEditor;
  }

  process.env.EDITOR = editor;
  saveEditorPreference(editor, configPath);
}

export function loadUserName(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config?.name || null;
    }
    return null;
  } catch (error) {
    console.log("Error reading config file, resetting preference");
    return null;
  }
}

export function saveUserName(name, configPath) {
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {};
  config.name = name;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export function loadEditorPreference(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config?.editor || null;
    }
    return null;
  } catch (error) {
    console.log("Error reading config file, resetting preference");
    return null;
  }
}

export function saveEditorPreference(editor, configPath) {
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {};
  config.editor = editor;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}
