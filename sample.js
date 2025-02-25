import "dotenv/config";
import inquirer from "inquirer";
import { execSync } from "child_process"; // ✅ Correct Import

// List of common text editors
const commonEditors = [
  "nano",
  "vim",
  "code",
  "subl",
  "gedit",
  "micro",
  "notepad",
  "notepad++",
];

// Function to check if an editor exists
function isEditorAvailable(editor) {
  try {
    const command =
      process.platform === "win32" ? `where ${editor}` : `command -v ${editor}`; // ✅ More reliable
    execSync(command, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Filter available editors
const availableEditors = commonEditors.filter(isEditorAvailable);

async function main() {
  let editorChoices = [...availableEditors, "custom"];

  if (editorChoices.length === 1) {
    console.log("No known editors detected! You must enter one manually.");
    editorChoices = ["custom"];
  }

  // Step 1: Ask the user for their preferred editor
  const { chosenEditor } = await inquirer.prompt([
    {
      type: "list",
      name: "chosenEditor",
      message: "Select your preferred text editor:",
      choices: editorChoices,
    },
  ]);

  let editor = chosenEditor;

  // Step 2: If the user selects "custom," ask for manual input
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

  // Step 3: Set the chosen editor in process.env
  process.env.EDITOR = editor;

  // Step 4: Open the editor prompt in Inquirer.js
  const { journalEntry } = await inquirer.prompt([
    {
      type: "editor",
      name: "journalEntry",
      message: "How was your day?",
    },
  ]);

  console.log("\nYour Journal Entry:\n", journalEntry);
}

main().catch(console.error);
