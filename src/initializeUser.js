import chalk from "chalk";
import ora from "ora";
import { getUserName, getEditorPreference } from "./config/userDetails.js";

export async function initializer(configPath) {
  console.log(
    chalk.blue.bold("Looks like you are new here, let's get you started.")
  );

  await getUserName(configPath);

  try {
    await getEditorPreference(configPath);
    console.log(chalk.green("Alright, Looks like you're all set!"));
  } catch (error) {
    console.error(error);
  }
}
