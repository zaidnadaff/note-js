import { execSync } from "child_process";
import { commonEditors } from "./utils/editors.js";
import inquirer from "inquirer";
import { saveEditorPreference } from "./config/fileConfig.js";

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

export async function chooseEditor() {
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
