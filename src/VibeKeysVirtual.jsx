import { useState, useEffect, useCallback, useRef } from "react";

const CATEGORIES = [
    {
        id: "quick",
        label: "⚡ 快捷回复",
        color: "#00ff88",
        commands: [
            { text: "继续", emoji: "▶️", desc: "让AI继续执行" },
            { text: "好的", emoji: "👍", desc: "确认同意" },
            { text: "是的，请继续", emoji: "✅", desc: "肯定并继续" },
            { text: "不，停下来", emoji: "🛑", desc: "停止当前操作" },
            { text: "撤销刚才的修改", emoji: "↩️", desc: "回退操作" },
            { text: "说中文", emoji: "🇨🇳", desc: "切换中文回复" },
        ],
    },
    {
        id: "review",
        label: "🔍 代码审查",
        color: "#ff6b35",
        commands: [
            { text: "解释一下这段代码", emoji: "📖", desc: "要求解释" },
            { text: "这段代码有什么问题？", emoji: "🐛", desc: "检查问题" },
            { text: "有没有更好的写法？", emoji: "💡", desc: "优化建议" },
            { text: "加上注释", emoji: "📝", desc: "添加注释" },
            { text: "写单元测试", emoji: "🧪", desc: "生成测试" },
            { text: "检查安全性", emoji: "🔒", desc: "安全审计" },
        ],
    },
    {
        id: "instruct",
        label: "🎯 指令控制",
        color: "#a78bfa",
        commands: [
            { text: "一步一步来，每步先跟我确认", emoji: "🪜", desc: "分步执行" },
            { text: "先给我看方案，不要直接改代码", emoji: "📋", desc: "先看方案" },
            { text: "只修改我说的地方，其他不要动", emoji: "🎯", desc: "精准修改" },
            { text: "把改动总结一下", emoji: "📊", desc: "总结变更" },
            { text: "回到上一个版本", emoji: "⏪", desc: "版本回退" },
            { text: "保存当前进度", emoji: "💾", desc: "保存进度" },
        ],
    },
    {
        id: "debug",
        label: "🐞 调试排错",
        color: "#f43f5e",
        commands: [
            { text: "报错了，帮我看看", emoji: "🚨", desc: "排查错误" },
            { text: "控制台报错信息如下：", emoji: "📟", desc: "贴错误日志" },
            { text: "为什么这里不生效？", emoji: "❓", desc: "排查原因" },
            { text: "帮我加上 console.log 调试", emoji: "🔬", desc: "添加调试" },
            { text: "类型报错了，帮我修复", emoji: "🔧", desc: "类型修复" },
            { text: "构建失败了，看看什么问题", emoji: "🏗️", desc: "构建排错" },
        ],
    },
    {
        id: "create",
        label: "🚀 功能开发",
        color: "#06b6d4",
        commands: [
            { text: "帮我实现这个功能：", emoji: "⚙️", desc: "新功能" },
            { text: "添加一个新的组件", emoji: "🧩", desc: "新组件" },
            { text: "帮我写一个 API 接口", emoji: "🔌", desc: "写接口" },
            { text: "加上响应式适配", emoji: "📱", desc: "响应式" },
            { text: "优化性能", emoji: "⚡", desc: "性能优化" },
            { text: "加上 loading 和错误处理", emoji: "🔄", desc: "状态处理" },
        ],
    },
    {
        id: "manage",
        label: "📦 项目管理",
        color: "#eab308",
        commands: [
            { text: "项目结构是怎样的？", emoji: "🗂️", desc: "查看结构" },
            { text: "帮我整理一下代码", emoji: "🧹", desc: "代码整理" },
            { text: "有哪些依赖需要更新？", emoji: "📦", desc: "依赖管理" },
            { text: "帮我写 README", emoji: "📄", desc: "写文档" },
            { text: "配置一下环境变量", emoji: "🔐", desc: "环境配置" },
            { text: "部署到生产环境", emoji: "🌐", desc: "部署上线" },
        ],
    },
];

const SMART_COMBOS = [
    {
        label: "🧠 完整 Code Review",
        commands: [
            "请仔细检查这段代码：",
            "1. 有没有 bug？",
            "2. 性能有没有问题？",
            "3. 安全性怎么样？",
            "4. 有什么改进建议？",
        ],
    },
    {
        label: "📐 新功能流程",
        commands: [
            "我要实现一个新功能，请按以下步骤来：",
            "1. 先分析需求，给出技术方案",
            "2. 等我确认后再动手写代码",
            "3. 每完成一个模块暂停让我检查",
            "4. 最后给我一个变更总结",
        ],
    },
    {
        label: "🔥 紧急修 Bug",
        commands: [
            "线上出 bug 了！请：",
            "1. 先定位问题原因",
            "2. 给出最小改动的修复方案",
            "3. 确保不影响其他功能",
            "4. 说明修复后的验证方法",
        ],
    },
];

// Floating particle component
function Particles() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        const particles = [];
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                o: Math.random() * 0.3 + 0.1,
            });
        }
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,136,${p.o})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

function Toast({ message, visible }) {
    return (
        <div
            style={{
                position: "fixed",
                bottom: 40,
                left: "50%",
                transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
                opacity: visible ? 1 : 0,
                background: "linear-gradient(135deg, #00ff88, #06b6d4)",
                color: "#0a0a0f",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.5px",
                boxShadow: "0 8px 32px rgba(0,255,136,0.3)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                zIndex: 9999,
                fontFamily: "'JetBrains Mono', monospace",
            }}
        >
            {message}
        </div>
    );
}

export default function VibeKeysVirtual() {
    const [activeCategory, setActiveCategory] = useState("quick");
    const [toast, setToast] = useState({ msg: "", show: false });
    const [history, setHistory] = useState([]);
    const [customCmd, setCustomCmd] = useState("");
    const [showCustom, setShowCustom] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showCombos, setShowCombos] = useState(false);
    const [pressedKey, setPressedKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const copyToClipboard = useCallback(
        (text) => {
            navigator.clipboard.writeText(text).then(() => {
                setToast({ msg: `✅ 已复制: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`, show: true });
                setHistory((prev) => {
                    const next = [{ text, time: Date.now() }, ...prev.filter((h) => h.text !== text)];
                    return next.slice(0, 20);
                });
                setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
            });
        },
        []
    );

    const handleCombo = useCallback(
        (combo) => {
            const full = combo.commands.join("\n");
            copyToClipboard(full);
        },
        [copyToClipboard]
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            const num = parseInt(e.key);
            if (num >= 1 && num <= 6) {
                const cat = CATEGORIES.find((c) => c.id === activeCategory);
                if (cat && cat.commands[num - 1]) {
                    setPressedKey(num - 1);
                    copyToClipboard(cat.commands[num - 1].text);
                    setTimeout(() => setPressedKey(null), 200);
                }
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [activeCategory, copyToClipboard]);

    const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

    // Filter commands by search
    const allCommands = CATEGORIES.flatMap((c) =>
        c.commands.map((cmd) => ({ ...cmd, catColor: c.color, catLabel: c.label }))
    );
    const filteredCommands = searchTerm
        ? allCommands.filter(
            (cmd) =>
                cmd.text.includes(searchTerm) || cmd.desc.includes(searchTerm)
        )
        : null;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0a0a0f",
                color: "#e0e0e0",
                fontFamily: "'JetBrains Mono', 'Noto Sans SC', monospace",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <link
                href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=Orbitron:wght@700;900&display=swap"
                rel="stylesheet"
            />
            <Particles />

            {/* Header */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    padding: "24px 32px 16px",
                    borderBottom: "1px solid rgba(0,255,136,0.1)",
                    background: "linear-gradient(180deg, rgba(0,255,136,0.03) 0%, transparent 100%)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #00ff88 0%, #06b6d4 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                boxShadow: "0 0 20px rgba(0,255,136,0.3)",
                            }}
                        >
                            ⌨️
                        </div>
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontWeight: 900,
                                    background: "linear-gradient(135deg, #00ff88, #06b6d4)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: "2px",
                                }}
                            >
                                VIBEKEYS
                            </h1>
                            <p style={{ margin: 0, fontSize: 11, color: "#666", letterSpacing: "1px" }}>
                                AI CODING 虚拟指挥键盘 — 监督 Cursor / Trae / Claude Code
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="🔍 搜索命令..."
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(0,255,136,0.2)",
                                borderRadius: 8,
                                padding: "8px 16px",
                                color: "#e0e0e0",
                                fontSize: 13,
                                width: 200,
                                outline: "none",
                                fontFamily: "'Noto Sans SC', sans-serif",
                            }}
                        />
                    </div>
                </div>

                {/* Top bar buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <button
                        onClick={() => { setShowCombos(!showCombos); setShowHistory(false); setShowCustom(false); }}
                        style={{
                            background: showCombos ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${showCombos ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
                            color: showCombos ? "#a78bfa" : "#888",
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontFamily: "'Noto Sans SC', sans-serif",
                            transition: "all 0.2s",
                        }}
                    >
                        🧠 智能组合
                    </button>
                    <button
                        onClick={() => { setShowCustom(!showCustom); setShowHistory(false); setShowCombos(false); }}
                        style={{
                            background: showCustom ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${showCustom ? "#06b6d4" : "rgba(255,255,255,0.1)"}`,
                            color: showCustom ? "#06b6d4" : "#888",
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontFamily: "'Noto Sans SC', sans-serif",
                            transition: "all 0.2s",
                        }}
                    >
                        ✏️ 自定义命令
                    </button>
                    <button
                        onClick={() => { setShowHistory(!showHistory); setShowCustom(false); setShowCombos(false); }}
                        style={{
                            background: showHistory ? "rgba(234,179,8,0.2)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${showHistory ? "#eab308" : "rgba(255,255,255,0.1)"}`,
                            color: showHistory ? "#eab308" : "#888",
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontFamily: "'Noto Sans SC', sans-serif",
                            transition: "all 0.2s",
                        }}
                    >
                        📜 历史 ({history.length})
                    </button>
                </div>
            </div>

            {/* Panels */}
            <div style={{ position: "relative", zIndex: 10 }}>
                {/* Smart Combos Panel */}
                {showCombos && (
                    <div
                        style={{
                            padding: "16px 32px",
                            borderBottom: "1px solid rgba(167,139,250,0.15)",
                            background: "rgba(167,139,250,0.03)",
                        }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                            {SMART_COMBOS.map((combo, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleCombo(combo)}
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(167,139,250,0.2)",
                                        borderRadius: 12,
                                        padding: "14px 16px",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        color: "#e0e0e0",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(167,139,250,0.1)";
                                        e.currentTarget.style.borderColor = "#a78bfa";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, fontFamily: "'Noto Sans SC', sans-serif" }}>
                                        {combo.label}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6, fontFamily: "'Noto Sans SC', sans-serif" }}>
                                        {combo.commands.map((c, j) => (
                                            <div key={j}>{c}</div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Command Panel */}
                {showCustom && (
                    <div
                        style={{
                            padding: "16px 32px",
                            borderBottom: "1px solid rgba(6,182,212,0.15)",
                            background: "rgba(6,182,212,0.03)",
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        <input
                            type="text"
                            value={customCmd}
                            onChange={(e) => setCustomCmd(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && customCmd.trim()) {
                                    copyToClipboard(customCmd.trim());
                                    setCustomCmd("");
                                }
                            }}
                            placeholder="输入自定义命令，按 Enter 复制..."
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(6,182,212,0.3)",
                                borderRadius: 8,
                                padding: "10px 16px",
                                color: "#e0e0e0",
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "'Noto Sans SC', sans-serif",
                            }}
                        />
                        <button
                            onClick={() => {
                                if (customCmd.trim()) {
                                    copyToClipboard(customCmd.trim());
                                    setCustomCmd("");
                                }
                            }}
                            style={{
                                background: "linear-gradient(135deg, #06b6d4, #00ff88)",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 20px",
                                color: "#0a0a0f",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 13,
                                fontFamily: "'Noto Sans SC', sans-serif",
                            }}
                        >
                            复制
                        </button>
                    </div>
                )}

                {/* History Panel */}
                {showHistory && (
                    <div
                        style={{
                            padding: "16px 32px",
                            borderBottom: "1px solid rgba(234,179,8,0.15)",
                            background: "rgba(234,179,8,0.03)",
                            maxHeight: 200,
                            overflowY: "auto",
                        }}
                    >
                        {history.length === 0 ? (
                            <p style={{ color: "#666", fontSize: 13, margin: 0, fontFamily: "'Noto Sans SC', sans-serif" }}>
                                暂无历史记录，点击任意命令即可记录
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {history.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(h.text)}
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(234,179,8,0.2)",
                                            borderRadius: 8,
                                            padding: "6px 12px",
                                            color: "#ccc",
                                            cursor: "pointer",
                                            fontSize: 12,
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "#eab308";
                                            e.currentTarget.style.color = "#eab308";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(234,179,8,0.2)";
                                            e.currentTarget.style.color = "#ccc";
                                        }}
                                    >
                                        {h.text.slice(0, 25)}{h.text.length > 25 ? "..." : ""}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div style={{ position: "relative", zIndex: 10, padding: "20px 32px 32px" }}>
                {/* Search Results */}
                {filteredCommands ? (
                    <div>
                        <p style={{ color: "#666", fontSize: 12, marginBottom: 12, fontFamily: "'Noto Sans SC', sans-serif" }}>
                            搜索结果: {filteredCommands.length} 条命令
                        </p>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: 10,
                            }}
                        >
                            {filteredCommands.map((cmd, i) => (
                                <button
                                    key={i}
                                    onClick={() => copyToClipboard(cmd.text)}
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: `1px solid ${cmd.catColor}33`,
                                        borderRadius: 12,
                                        padding: "14px 16px",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        color: "#e0e0e0",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `${cmd.catColor}15`;
                                        e.currentTarget.style.borderColor = cmd.catColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        e.currentTarget.style.borderColor = `${cmd.catColor}33`;
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>{cmd.emoji}</span>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>
                                        {cmd.text}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#666", marginTop: 2, fontFamily: "'Noto Sans SC', sans-serif" }}>
                                        {cmd.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Category Tabs */}
                        <div
                            style={{
                                display: "flex",
                                gap: 6,
                                marginBottom: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        style={{
                                            background: isActive ? `${cat.color}18` : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${isActive ? cat.color : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: 10,
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            color: isActive ? cat.color : "#666",
                                            fontSize: 13,
                                            fontWeight: isActive ? 700 : 400,
                                            transition: "all 0.2s",
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.borderColor = `${cat.color}66`;
                                                e.currentTarget.style.color = cat.color;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                                e.currentTarget.style.color = "#666";
                                            }
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Command Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: 12,
                            }}
                        >
                            {activeCat.commands.map((cmd, i) => {
                                const isPressed = pressedKey === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(cmd.text)}
                                        style={{
                                            background: isPressed
                                                ? `${activeCat.color}25`
                                                : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                                            border: `1px solid ${isPressed ? activeCat.color : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: 14,
                                            padding: "18px 16px",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            transition: "all 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                                            transform: isPressed ? "scale(0.96)" : "scale(1)",
                                            position: "relative",
                                            overflow: "hidden",
                                            color: "#e0e0e0",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `${activeCat.color}12`;
                                            e.currentTarget.style.borderColor = `${activeCat.color}88`;
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 8px 24px ${activeCat.color}15`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                                "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {/* Key number badge */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 10,
                                                width: 22,
                                                height: 22,
                                                borderRadius: 6,
                                                background: "rgba(255,255,255,0.06)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 10,
                                                color: "#555",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>{cmd.emoji}</div>
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 600,
                                                lineHeight: 1.4,
                                                fontFamily: "'Noto Sans SC', sans-serif",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {cmd.text}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "#555",
                                                fontFamily: "'Noto Sans SC', sans-serif",
                                            }}
                                        >
                                            {cmd.desc}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Bottom tips */}
                        <div
                            style={{
                                marginTop: 28,
                                padding: "14px 18px",
                                background: "rgba(255,255,255,0.02)",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 16,
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontSize: 11, color: "#444", fontFamily: "'Noto Sans SC', sans-serif" }}>
                                💡 使用提示:
                            </span>
                            <span style={{ fontSize: 11, color: "#555", fontFamily: "'Noto Sans SC', sans-serif" }}>
                                按 <kbd style={{ background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 4, color: "#00ff88", border: "1px solid rgba(0,255,136,0.2)" }}>1-6</kbd> 快捷复制当前分类命令
                            </span>
                            <span style={{ fontSize: 11, color: "#555", fontFamily: "'Noto Sans SC', sans-serif" }}>
                                点击按钮 → 自动复制 → 粘贴到 AI 工具
                            </span>
                            <span style={{ fontSize: 11, color: "#555", fontFamily: "'Noto Sans SC', sans-serif" }}>
                                支持 Cursor / Windsurf / Trae / Claude Code / Copilot
                            </span>
                        </div>
                    </>
                )}
            </div>

            <Toast message={toast.msg} visible={toast.show} />
        </div>
    );
}
