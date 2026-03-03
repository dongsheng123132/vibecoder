// Each tool has a "recipe" — the sequence of keystrokes to send a command
export const TOOL_RECIPES = {
  Cursor: {
    label: 'Cursor',
    type: 'editor',
    focusChat: 'cmd+l',
    paste: 'cmd+v',
    send: 'return',
    delay: 200,
  },
  Code: {
    label: 'VS Code + Copilot',
    type: 'editor',
    focusChat: 'cmd+i',
    paste: 'cmd+v',
    send: 'return',
    delay: 200,
  },
  Trae: {
    label: 'Trae',
    type: 'editor',
    focusChat: null,
    paste: 'cmd+v',
    send: 'return',
    delay: 200,
  },
  Windsurf: {
    label: 'Windsurf',
    type: 'editor',
    focusChat: null,
    paste: 'cmd+v',
    send: 'return',
    delay: 200,
  },
  Terminal: {
    label: 'Terminal',
    type: 'terminal',
    focusChat: null,
    paste: 'cmd+v',
    send: 'return',
    delay: 100,
  },
  ClaudeCodeCLI: {
    label: 'Claude Code CLI',
    type: 'terminal',
    focusChat: null,
    paste: 'cmd+v',
    send: 'return',
    delay: 100,
  },
  KimiCLI: {
    label: 'Kimi CLI',
    type: 'terminal',
    focusChat: null,
    paste: 'cmd+v',
    send: 'return',
    delay: 100,
  },
};

// Get the recipe for a detected tool
export function getRecipeForTool(tool) {
  return TOOL_RECIPES[tool] || TOOL_RECIPES.Terminal;
}

// All available tool names for manual selection
export const TOOL_LIST = Object.entries(TOOL_RECIPES).map(([key, val]) => ({
  key,
  label: val.label,
  type: val.type,
}));
