// Command definitions migrated from V1 + enhanced with tool variants
// variants: optional per-tool text overrides (tool key → text)

export const CATEGORIES = [
  {
    id: 'quick',
    label: '⚡ 快捷回复',
    color: '#00ff88',
    commands: [
      {
        text: '继续',
        emoji: '▶️',
        desc: '让AI继续执行',
        variants: {
          ClaudeCodeCLI: '继续执行，直到没有错误',
          Cursor: '继续生成，直到完整代码结束',
        },
      },
      { text: '好的', emoji: '👍', desc: '确认同意' },
      { text: '是的，请继续', emoji: '✅', desc: '肯定并继续' },
      {
        text: '不，停下来',
        emoji: '🛑',
        desc: '停止当前操作',
        variants: {
          ClaudeCodeCLI: '停止，不要继续修改',
        },
      },
      { text: '撤销刚才的修改', emoji: '↩️', desc: '回退操作' },
      { text: '说中文', emoji: '🇨🇳', desc: '切换中文回复' },
    ],
  },
  {
    id: 'review',
    label: '🔍 代码审查',
    color: '#ff6b35',
    commands: [
      { text: '解释一下这段代码', emoji: '📖', desc: '要求解释' },
      { text: '这段代码有什么问题？', emoji: '🐛', desc: '检查问题' },
      { text: '有没有更好的写法？', emoji: '💡', desc: '优化建议' },
      { text: '加上注释', emoji: '📝', desc: '添加注释' },
      { text: '写单元测试', emoji: '🧪', desc: '生成测试' },
      { text: '检查安全性', emoji: '🔒', desc: '安全审计' },
    ],
  },
  {
    id: 'instruct',
    label: '🎯 指令控制',
    color: '#a78bfa',
    commands: [
      { text: '一步一步来，每步先跟我确认', emoji: '🪜', desc: '分步执行' },
      { text: '先给我看方案，不要直接改代码', emoji: '📋', desc: '先看方案' },
      { text: '只修改我说的地方，其他不要动', emoji: '🎯', desc: '精准修改' },
      { text: '把改动总结一下', emoji: '📊', desc: '总结变更' },
      { text: '回到上一个版本', emoji: '⏪', desc: '版本回退' },
      { text: '保存当前进度', emoji: '💾', desc: '保存进度' },
    ],
  },
  {
    id: 'debug',
    label: '🐞 调试排错',
    color: '#f43f5e',
    commands: [
      { text: '报错了，帮我看看', emoji: '🚨', desc: '排查错误' },
      { text: '控制台报错信息如下：', emoji: '📟', desc: '贴错误日志' },
      { text: '为什么这里不生效？', emoji: '❓', desc: '排查原因' },
      { text: '帮我加上 console.log 调试', emoji: '🔬', desc: '添加调试' },
      { text: '类型报错了，帮我修复', emoji: '🔧', desc: '类型修复' },
      { text: '构建失败了，看看什么问题', emoji: '🏗️', desc: '构建排错' },
    ],
  },
  {
    id: 'create',
    label: '🚀 功能开发',
    color: '#06b6d4',
    commands: [
      { text: '帮我实现这个功能：', emoji: '⚙️', desc: '新功能' },
      { text: '添加一个新的组件', emoji: '🧩', desc: '新组件' },
      { text: '帮我写一个 API 接口', emoji: '🔌', desc: '写接口' },
      { text: '加上响应式适配', emoji: '📱', desc: '响应式' },
      { text: '优化性能', emoji: '⚡', desc: '性能优化' },
      { text: '加上 loading 和错误处理', emoji: '🔄', desc: '状态处理' },
    ],
  },
  {
    id: 'manage',
    label: '📦 项目管理',
    color: '#eab308',
    commands: [
      { text: '项目结构是怎样的？', emoji: '🗂️', desc: '查看结构' },
      { text: '帮我整理一下代码', emoji: '🧹', desc: '代码整理' },
      { text: '有哪些依赖需要更新？', emoji: '📦', desc: '依赖管理' },
      { text: '帮我写 README', emoji: '📄', desc: '写文档' },
      { text: '配置一下环境变量', emoji: '🔐', desc: '环境配置' },
      { text: '部署到生产环境', emoji: '🌐', desc: '部署上线' },
    ],
  },
];

export const SMART_COMBOS = [
  {
    id: 'code-review',
    label: '🧠 完整 Code Review',
    commands: [
      '请仔细检查这段代码：',
      '1. 有没有 bug？',
      '2. 性能有没有问题？',
      '3. 安全性怎么样？',
      '4. 有什么改进建议？',
    ],
  },
  {
    id: 'new-feature',
    label: '📐 新功能流程',
    commands: [
      '我要实现一个新功能，请按以下步骤来：',
      '1. 先分析需求，给出技术方案',
      '2. 等我确认后再动手写代码',
      '3. 每完成一个模块暂停让我检查',
      '4. 最后给我一个变更总结',
    ],
  },
  {
    id: 'bug-fix',
    label: '🔥 紧急修 Bug',
    commands: [
      '线上出 bug 了！请：',
      '1. 先定位问题原因',
      '2. 给出最小改动的修复方案',
      '3. 确保不影响其他功能',
      '4. 说明修复后的验证方法',
    ],
  },
];

// Get command text for a specific tool (respects variants)
export function getCommandText(command, tool) {
  if (command.variants && command.variants[tool]) {
    return command.variants[tool];
  }
  return command.text;
}
