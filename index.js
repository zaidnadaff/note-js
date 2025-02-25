import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Commander setup
const program = new Command();

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
  .action((options) => viewEntries(options.limit));

program
  .command("start")
  .description("Start the interactive journal")
  .action(() => showMainMenu());

// Main menu
function showMainMenu() {
  console.log(chalk.blue.bold("\n==== Journal App ===="));

  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Create new entry", value: "create" },
          { name: "View past entries", value: "view" },
          { name: "Exit", value: "exit" },
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "create":
          createEntry();
          break;
        case "view":
          viewEntries();
          break;
        case "exit":
          console.log(chalk.green("Goodbye!"));
          process.exit(0);
      }
    });
}

// Create new journal entry
function createEntry() {
  const date = new Date().toISOString().split("T")[0];

  console.log(chalk.blue(`\nCreating entry for ${chalk.bold(date)}`));

  inquirer
    .prompt([
      {
        type: "editor",
        name: "content",
        message: "How was your day? (Your default editor will open)",
        default: `# Journal Entry - ${date}\n\n`,
      },
      {
        type: "confirm",
        name: "save",
        message: "Save this entry?",
        default: true,
      },
    ])
    .then((answers) => {
      if (answers.save) {
        saveEntry(date, answers.content);
      } else {
        console.log(chalk.yellow("Entry discarded."));
        showMainMenu();
      }
    });
}

// Save entry to Supabase
async function saveEntry(date, content) {
  try {
    console.log(chalk.yellow("Saving your entry..."));

    const { data, error } = await supabase.from("journal_entries").insert([
      {
        date: date,
        content: content,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    console.log(chalk.green("Entry saved successfully!"));
  } catch (err) {
    console.error(chalk.red("Error saving entry:"), err.message);
  } finally {
    showMainMenu();
  }
}

// View past entries
async function viewEntries(limit = 10) {
  try {
    console.log(chalk.yellow("Loading your entries..."));

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (data.length === 0) {
      console.log(chalk.yellow("No entries found."));
    } else {
      console.log(chalk.blue.bold("\n==== Past Entries ===="));
      data.forEach((entry) => {
        console.log(chalk.green.bold(`\n${entry.date}:`));
        console.log(entry.content);
        console.log(chalk.dim("--------------------"));
      });
    }
  } catch (err) {
    console.error(chalk.red("Error retrieving entries:"), err.message);
  } finally {
    // Only show main menu if run interactively
    if (!program.args.length) {
      showMainMenu();
    }
  }
}

// Initialize
if (process.argv.length > 2) {
  program.parse();
} else {
  console.log(chalk.blue.bold("Welcome to your journal!"));
  showMainMenu();
}
