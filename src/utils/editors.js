import { execSync } from "child_process";
export const commonEditors = ["nano", "vim", "code", "gedit", "notepad"];

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

export function getAvailableEditors() {
  let availableEditors = commonEditors.filter(isEditorAvailable);
  availableEditors = [...availableEditors, "custom"];
  return availableEditors;
}

const availableEditors = getAvailableEditors();
