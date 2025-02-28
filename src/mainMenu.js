import inquirer from "inquirer";
import chalk from "chalk";
import { createEntry, viewEntries } from "./commands/entryOperations.js";
import { getEditorPreference } from "./config/userDetails.js";

export function showMainMenu(configpath, userName) {
  console.log(chalk.blue.bold(`\n==== ${userName}'s journal ====`));

  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Create new entry", value: "create" },
          { name: "View past entries", value: "view" },
          { name: "Change preferred editor", value: "editor" },
          { name: "Exit", value: "exit" },
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "create":
          createEntry().then(() => showMainMenu(configpath, userName));
          break;
        case "view":
          viewEntries().then(() => showMainMenu(configpath, userName));
          break;
        case "editor":
          getEditorPreference().then(() => showMainMenu(configpath, userName));
          break;
        case "exit":
          console.log(chalk.green("Goodbye!"));
          process.exit(0);
      }
    });
}
