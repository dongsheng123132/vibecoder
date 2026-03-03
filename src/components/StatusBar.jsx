import { TOOL_LIST } from '../data/toolRecipes';

export default function StatusBar({
  currentTool,
  manualTool,
  onSelectTool,
  onClearOverride,
  combo,
  level,
  levelTitle,
  xpProgress,
  todayCount,
  streak,
}) {
  const toolLabel = TOOL_LIST.find((t) => t.key === currentTool)?.label || currentTool;

  return (
    <div className="status-bar">
      {/* Left: target tool */}
      <div className="status-tool">
        <span className="status-dot" />
        <span className="status-tool-label">{toolLabel}</span>
        {manualTool && (
          <button className="status-clear-btn" onClick={onClearOverride} title="恢复自动检测">
            ✕
          </button>
        )}
        <select
          className="status-tool-select"
          value={currentTool}
          onChange={(e) => onSelectTool(e.target.value)}
        >
          {TOOL_LIST.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Center: combo */}
      {combo > 1 && (
        <div className="status-combo">
          <span className="combo-number">{combo}x</span>
          <span className="combo-label">COMBO</span>
        </div>
      )}

      {/* Right: level + stats */}
      <div className="status-right">
        {streak > 1 && <span className="status-streak">{streak}d</span>}
        <span className="status-today">Today: {todayCount}</span>
        <div className="status-level">
          <span className="level-badge">Lv.{level}</span>
          <span className="level-title">{levelTitle}</span>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpProgress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
