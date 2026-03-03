import { getCommandText } from '../data/commands';

export default function CommandGrid({ commands, categoryColor, currentTool, onCommand, pressedKey }) {
  return (
    <div className="command-grid">
      {commands.map((cmd, i) => {
        const text = getCommandText(cmd, currentTool);
        const isPressed = pressedKey === i;
        return (
          <button
            key={i}
            className={`command-card ${isPressed ? 'pressed' : ''}`}
            onClick={() => onCommand(text, cmd)}
            style={{ '--cat-color': categoryColor }}
          >
            <div className="command-key-badge">{i + 1}</div>
            <div className="command-emoji">{cmd.emoji}</div>
            <div className="command-text">{text}</div>
            <div className="command-desc">{cmd.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
