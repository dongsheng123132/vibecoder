import { useState } from 'react';
import { SMART_COMBOS } from '../data/commands';

export default function WorkflowPanel({ onRunWorkflow, onRunSingle }) {
  const [running, setRunning] = useState(null);
  const [customSteps, setCustomSteps] = useState(['']);
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const handleRun = async (workflow) => {
    setRunning(workflow.id || 'custom');
    for (let i = 0; i < workflow.commands.length; i++) {
      await onRunSingle(workflow.commands[i]);
      if (i < workflow.commands.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    setRunning(null);
  };

  const addStep = () => setCustomSteps((prev) => [...prev, '']);
  const removeStep = (idx) => setCustomSteps((prev) => prev.filter((_, i) => i !== idx));
  const updateStep = (idx, val) =>
    setCustomSteps((prev) => prev.map((s, i) => (i === idx ? val : s)));

  const runCustom = () => {
    const cmds = customSteps.filter((s) => s.trim());
    if (cmds.length > 0) {
      handleRun({ id: 'custom', commands: cmds });
    }
  };

  return (
    <div className="workflow-panel">
      <div className="workflow-header">
        <span className="workflow-title">WORKFLOWS</span>
        <button
          className={`workflow-toggle-btn ${showCustomEditor ? 'active' : ''}`}
          onClick={() => setShowCustomEditor(!showCustomEditor)}
        >
          {showCustomEditor ? '← 预设' : '+ 自定义'}
        </button>
      </div>

      {!showCustomEditor ? (
        <div className="workflow-list">
          {SMART_COMBOS.map((wf) => (
            <div key={wf.id} className="workflow-card">
              <div className="workflow-card-header">
                <span>{wf.label}</span>
                <button
                  className="workflow-run-btn"
                  onClick={() => handleRun(wf)}
                  disabled={running !== null}
                >
                  {running === wf.id ? '⏳ 执行中...' : '▶ 执行'}
                </button>
              </div>
              <div className="workflow-steps">
                {wf.commands.map((cmd, i) => (
                  <div key={i} className="workflow-step">
                    <span className="workflow-step-num">{i + 1}</span>
                    <span className="workflow-step-text">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="workflow-custom">
          <div className="workflow-custom-steps">
            {customSteps.map((step, i) => (
              <div key={i} className="workflow-custom-row">
                <span className="workflow-step-num">{i + 1}</span>
                <input
                  className="workflow-custom-input"
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder="输入命令..."
                />
                {customSteps.length > 1 && (
                  <button className="workflow-remove-btn" onClick={() => removeStep(i)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="workflow-custom-actions">
            <button className="workflow-add-btn" onClick={addStep}>
              + 添加步骤
            </button>
            <button
              className="workflow-run-btn"
              onClick={runCustom}
              disabled={running !== null || customSteps.every((s) => !s.trim())}
            >
              {running === 'custom' ? '⏳ 执行中...' : '▶ 执行自定义'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
