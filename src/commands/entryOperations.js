import supabase from "../config/supabaseConfig.js";
import inquirer from "inquirer";
import chalk from "chalk";

export function createEntry() {
  return new Promise((resolve) => {
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
          saveEntry(date, answers.content).then(resolve);
        } else {
          console.log(chalk.yellow("Entry discarded."));
          resolve();
        }
      });
  });
}
export async function saveEntry(date, content) {
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
  }
}

export async function viewEntries(limit = 10) {
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
  }
}
