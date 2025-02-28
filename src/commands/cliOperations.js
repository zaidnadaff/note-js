import { Command } from "commander";
import { createEntry, viewEntries } from "./entryOperations.js";
import { showMainMenu } from "../mainMenu.js";

const program = new Command();

export function setupCommands() {
  program
    .name("journal")
    .description("A CLI journal application")
    .version("1.0.0");

  program
    .command("new")
    .description("Create a new journal entry")
    .action(() => createEntry());

  program
    .command("list")
    .description("List recent journal entries")
    .option("-l, --limit <number>", "limit the number of entries", "10")
    .action((options) => viewEntries(options.limit, false));

  program
    .command("start")
    .description("Start the interactive journal")
    .action(() => showMainMenu());

  return program;
}
