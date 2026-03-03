import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Map window app names to our tool identifiers
const APP_MAP = {
  'Cursor': 'Cursor',
  'Code': 'Code',           // VS Code
  'Trae': 'Trae',
  'Windsurf': 'Windsurf',
  'Terminal': 'Terminal',
  'iTerm2': 'iTerm2',
  'Warp': 'Warp',
  'Alacritty': 'Terminal',
  'kitty': 'Terminal',
};

// Terminal apps that might be running Claude Code or Kimi CLI
const TERMINAL_APPS = ['Terminal', 'iTerm2', 'Warp', 'Alacritty', 'kitty'];

export async function detectActiveWindow() {
  if (process.platform !== 'darwin') {
    return { app: 'Unknown', title: '', tool: 'Terminal' };
  }

  try {
    const script = `
      tell application "System Events"
        set frontApp to name of first application process whose frontmost is true
        set frontTitle to ""
        try
          tell process frontApp
            set frontTitle to name of front window
          end tell
        end try
        return frontApp & "|||" & frontTitle
      end tell
    `;

    const { stdout } = await execAsync(`osascript -e '${script.replace(/'/g, "'\\''")}'`);
    const [appName, windowTitle] = stdout.trim().split('|||');

    let tool = APP_MAP[appName] || 'Unknown';

    // For terminal apps, check if Claude Code or Kimi CLI is running
    if (TERMINAL_APPS.includes(appName) || tool === 'Terminal') {
      const titleLower = (windowTitle || '').toLowerCase();
      if (titleLower.includes('claude') || titleLower.includes('claude-code')) {
        tool = 'ClaudeCodeCLI';
      } else if (titleLower.includes('kimi')) {
        tool = 'KimiCLI';
      } else {
        tool = 'Terminal';
      }
    }

    return { app: appName, title: windowTitle || '', tool };
  } catch (e) {
    return null;
  }
}
