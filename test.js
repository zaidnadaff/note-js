import "dotenv/config";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import os, { type } from "os";

const configPath = path.join(
  process.env.HOME || os.homedir(),
  ".config",
  ".note-js.config.json"
);

const commonEditors = ["nano", "vim", "code", "gedit", "notepad"];

function isEditorAvailable(editor) {
  try {
    const command =
      process.platform === "win32" ? `where ${editor}` : `command -v ${editor}`;
    execSync(command, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const availableEditors = commonEditors.filter(isEditorAvailable);

function loadEditorPrefernce() {
  try {
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, "utf-8");
      if (config) {
        return JSON.parse(config).editor || null;
      }
      return null;
    }
  } catch (error) {
    console.log("Error reading config file, resetting preference");
    return null;
  }
}

function saveEditorPreference(editor) {
  fs.writeFileSync(configPath, JSON.stringify({ editor }, null, 2), "utf-8");
}

async function chooseEditor() {
  let editorChoices = [...availableEditors, "custom"];
  console.log(availableEditors);

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
  const action = await inquirer.prompt([
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
  menu();
}

async function main() {
  console.log(loadEditorPrefernce());
  //   const editor = await chooseEditor();
  //   console.log(editor);
  //   console.log(loadEditorPrefernce());
}
main();
