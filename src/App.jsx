import { useState, useEffect, useCallback } from 'react';
import TitleBar from './components/TitleBar';
import CategoryBar from './components/CategoryBar';
import CommandGrid from './components/CommandGrid';
import StatusBar from './components/StatusBar';
import StatsPanel from './components/StatsPanel';
import WorkflowPanel from './components/WorkflowPanel';
import Particles from './components/Particles';
import Toast from './components/Toast';
import { CATEGORIES, getCommandText } from './data/commands';
import { getRecipeForTool } from './data/toolRecipes';
import { useActiveWindow } from './hooks/useActiveWindow';
import { useStats } from './hooks/useStats';
import { useGamification } from './hooks/useGamification';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('quick');
  const [toast, setToast] = useState({ msg: '', show: false });
  const [history, setHistory] = useState([]);
  const [customCmd, setCustomCmd] = useState('');
  const [pressedKey, setPressedKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePanel, setActivePanel] = useState(null); // 'stats' | 'workflow' | 'history' | 'custom' | null
  const [comboFlash, setComboFlash] = useState(false);

  const { currentTool, manualTool, setOverrideTool, clearOverride } = useActiveWindow();
  const { stats, todayCount, recordCommand, getLast7Days, getTop5 } = useStats();
  const { level, levelTitle, xpProgress, combo, streak, showLevelUp, addXP } = useGamification();

  // Show toast
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  }, []);

  // Send a command (via Electron or clipboard fallback)
  const sendCommand = useCallback(
    async (text) => {
      const recipe = getRecipeForTool(currentTool);

      if (window.electronAPI) {
        // Copy to clipboard first
        await window.electronAPI.copyToClipboard(text);

        // Try to send to app
        const result = await window.electronAPI.sendCommand({ text, tool: currentTool, recipe });
        if (result.success) {
          showToast(`⚡ 已发送: "${text.slice(0, 25)}${text.length > 25 ? '...' : ''}"`);
        } else {
          showToast(`✅ 已复制: "${text.slice(0, 25)}${text.length > 25 ? '...' : ''}"`);
        }
      } else {
        // Fallback: clipboard only
        await navigator.clipboard.writeText(text);
        showToast(`✅ 已复制: "${text.slice(0, 25)}${text.length > 25 ? '...' : ''}"`);
      }

      // Record stats & gamification
      recordCommand(text);
      addXP();

      // History
      setHistory((prev) => {
        const next = [{ text, time: Date.now() }, ...prev.filter((h) => h.text !== text)];
        return next.slice(0, 20);
      });

      // Combo flash
      if (combo >= 2) {
        setComboFlash(true);
        setTimeout(() => setComboFlash(false), 300);
      }
    },
    [currentTool, showToast, recordCommand, addXP, combo]
  );

  // Handle command button click
  const handleCommand = useCallback(
    (text) => {
      sendCommand(text);
    },
    [sendCommand]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        const cat = CATEGORIES.find((c) => c.id === activeCategory);
        if (cat && cat.commands[num - 1]) {
          setPressedKey(num - 1);
          const text = getCommandText(cat.commands[num - 1], currentTool);
          sendCommand(text);
          setTimeout(() => setPressedKey(null), 200);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeCategory, currentTool, sendCommand]);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  // Search
  const allCommands = CATEGORIES.flatMap((c) =>
    c.commands.map((cmd) => ({ ...cmd, catColor: c.color, catLabel: c.label }))
  );
  const filteredCommands = searchTerm
    ? allCommands.filter((cmd) => cmd.text.includes(searchTerm) || cmd.desc.includes(searchTerm))
    : null;

  // Smart sorting: order by frequency
  const getSortedCommands = (commands) => {
    if (!stats.commandFreq) return commands;
    return [...commands].sort((a, b) => {
      const freqA = stats.commandFreq[a.text] || 0;
      const freqB = stats.commandFreq[b.text] || 0;
      return freqB - freqA;
    });
  };

  const togglePanel = (name) => {
    setActivePanel((prev) => (prev === name ? null : name));
  };

  return (
    <div className={`app-container ${comboFlash ? 'combo-flash' : ''}`}>
      <Particles />
      <TitleBar />

      {/* Main scrollable area */}
      <div className="app-body">
        {/* Search + panel buttons */}
        <div className="top-bar">
          <input
            className="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索命令..."
          />
          <div className="panel-buttons">
            <button
              className={`panel-btn ${activePanel === 'stats' ? 'active' : ''}`}
              onClick={() => togglePanel('stats')}
              style={{ '--btn-color': '#06b6d4' }}
            >
              📊 统计
            </button>
            <button
              className={`panel-btn ${activePanel === 'workflow' ? 'active' : ''}`}
              onClick={() => togglePanel('workflow')}
              style={{ '--btn-color': '#a78bfa' }}
            >
              🔗 工作流
            </button>
            <button
              className={`panel-btn ${activePanel === 'custom' ? 'active' : ''}`}
              onClick={() => togglePanel('custom')}
              style={{ '--btn-color': '#06b6d4' }}
            >
              ✏️ 自定义
            </button>
            <button
              className={`panel-btn ${activePanel === 'history' ? 'active' : ''}`}
              onClick={() => togglePanel('history')}
              style={{ '--btn-color': '#eab308' }}
            >
              📜 历史 ({history.length})
            </button>
          </div>
        </div>

        {/* Expandable panels */}
        {activePanel === 'stats' && (
          <StatsPanel
            getLast7Days={getLast7Days}
            getTop5={getTop5}
            todayCount={todayCount}
            stats={stats}
          />
        )}

        {activePanel === 'workflow' && (
          <WorkflowPanel
            onRunWorkflow={(wf) => {
              wf.commands.forEach((cmd) => sendCommand(cmd));
            }}
            onRunSingle={sendCommand}
          />
        )}

        {activePanel === 'custom' && (
          <div className="custom-panel">
            <input
              className="custom-input"
              type="text"
              value={customCmd}
              onChange={(e) => setCustomCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customCmd.trim()) {
                  sendCommand(customCmd.trim());
                  setCustomCmd('');
                }
              }}
              placeholder="输入自定义命令，按 Enter 发送..."
            />
            <button
              className="custom-send-btn"
              onClick={() => {
                if (customCmd.trim()) {
                  sendCommand(customCmd.trim());
                  setCustomCmd('');
                }
              }}
            >
              发送
            </button>
          </div>
        )}

        {activePanel === 'history' && (
          <div className="history-panel">
            {history.length === 0 ? (
              <p className="history-empty">暂无历史记录</p>
            ) : (
              <div className="history-tags">
                {history.map((h, i) => (
                  <button key={i} className="history-tag" onClick={() => sendCommand(h.text)}>
                    {h.text.slice(0, 25)}{h.text.length > 25 ? '...' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search results or Category + Grid */}
        {filteredCommands ? (
          <div className="search-results">
            <p className="search-count">搜索结果: {filteredCommands.length} 条</p>
            <div className="command-grid">
              {filteredCommands.map((cmd, i) => (
                <button
                  key={i}
                  className="command-card"
                  onClick={() => handleCommand(getCommandText(cmd, currentTool))}
                  style={{ '--cat-color': cmd.catColor }}
                >
                  <div className="command-emoji">{cmd.emoji}</div>
                  <div className="command-text">{getCommandText(cmd, currentTool)}</div>
                  <div className="command-desc">{cmd.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <CategoryBar
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
            <CommandGrid
              commands={activeCat.commands}
              categoryColor={activeCat.color}
              currentTool={currentTool}
              onCommand={handleCommand}
              pressedKey={pressedKey}
            />
          </>
        )}
      </div>

      {/* Level up animation */}
      {showLevelUp && (
        <div className="level-up-overlay">
          <div className="level-up-text">LEVEL UP!</div>
          <div className="level-up-level">Lv.{level} {levelTitle}</div>
        </div>
      )}

      {/* Combo display */}
      {combo > 2 && (
        <div className="combo-display">
          <span className="combo-big">{combo}x</span>
          <span className="combo-word">COMBO!</span>
        </div>
      )}

      <StatusBar
        currentTool={currentTool}
        manualTool={manualTool}
        onSelectTool={setOverrideTool}
        onClearOverride={clearOverride}
        combo={combo}
        level={level}
        levelTitle={levelTitle}
        xpProgress={xpProgress}
        todayCount={todayCount}
        streak={streak}
      />

      <Toast message={toast.msg} visible={toast.show} />
    </div>
  );
}
