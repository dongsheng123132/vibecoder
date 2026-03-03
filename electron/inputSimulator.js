import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Execute an AppleScript command
async function runAppleScript(script) {
  const escaped = script.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  await execAsync(`osascript -e "${escaped}"`);
}

// Simulate a keystroke via AppleScript
async function keystroke(key, modifiers = []) {
  let modStr = '';
  if (modifiers.length > 0) {
    const modMap = {
      cmd: 'command down',
      shift: 'shift down',
      alt: 'option down',
      ctrl: 'control down',
    };
    modStr = ' using {' + modifiers.map((m) => modMap[m]).join(', ') + '}';
  }

  if (key === 'return') {
    await runAppleScript(`tell application "System Events" to key code 36${modStr}`);
  } else {
    await runAppleScript(`tell application "System Events" to keystroke "${key}"${modStr}`);
  }
}

// Parse a shortcut string like "cmd+l" into {key, modifiers}
function parseShortcut(shortcut) {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts.pop();
  return { key, modifiers: parts };
}

export async function sendToApp(text, toolName, recipe, windowInfo) {
  if (process.platform !== 'darwin') {
    throw new Error('Input simulation is only supported on macOS');
  }

  const targetApp = windowInfo?.app;
  if (!targetApp) {
    throw new Error('No target application detected');
  }

  // Activate the target app
  await runAppleScript(`tell application "${targetApp}" to activate`);
  await sleep(recipe.delay || 150);

  // Step 1: Focus chat if recipe requires it
  if (recipe.focusChat) {
    const { key, modifiers } = parseShortcut(recipe.focusChat);
    await keystroke(key, modifiers);
    await sleep(recipe.delay || 200);
  }

  // Step 2: Paste (clipboard was already set by main process)
  const { key: pasteKey, modifiers: pasteMods } = parseShortcut(recipe.paste || 'cmd+v');
  await keystroke(pasteKey, pasteMods);
  await sleep(recipe.delay || 150);

  // Step 3: Send (press Enter)
  if (recipe.send) {
    const { key: sendKey, modifiers: sendMods } = parseShortcut(recipe.send);
    await keystroke(sendKey, sendMods);
  }
}
