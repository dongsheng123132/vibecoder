import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const NEON_GREEN = '#00ff88';
const CYBER_BLUE = '#06b6d4';
const PURPLE = '#a78bfa';

export default function StatsPanel({ getLast7Days, getTop5, todayCount, stats }) {
  const last7 = getLast7Days();
  const top5 = getTop5();

  // Heatmap: 24 hours
  const hourData = Array.from({ length: 24 }, (_, h) => ({
    hour: String(h).padStart(2, '0'),
    count: stats.hourly[String(h)] || 0,
  }));
  const maxHourly = Math.max(...hourData.map((d) => d.count), 1);

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <span className="stats-title">STATISTICS</span>
        <span className="stats-today">Today: {todayCount} cmds</span>
      </div>

      {/* 7-day line chart */}
      <div className="stats-chart">
        <div className="stats-chart-label">7-Day Activity</div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={last7}>
            <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: `1px solid ${NEON_GREEN}44`,
                borderRadius: 8,
                fontSize: 11,
                color: NEON_GREEN,
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={NEON_GREEN}
              strokeWidth={2}
              dot={{ fill: NEON_GREEN, r: 3 }}
              activeDot={{ r: 5, fill: CYBER_BLUE }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 commands */}
      {top5.length > 0 && (
        <div className="stats-chart">
          <div className="stats-chart-label">Top Commands</div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={top5} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="text"
                tick={{ fill: '#888', fontSize: 10 }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: `1px solid ${CYBER_BLUE}44`,
                  borderRadius: 8,
                  fontSize: 11,
                  color: CYBER_BLUE,
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {top5.map((_, idx) => (
                  <Cell key={idx} fill={[NEON_GREEN, CYBER_BLUE, PURPLE, '#f43f5e', '#eab308'][idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hourly heatmap */}
      <div className="stats-chart">
        <div className="stats-chart-label">Hourly Heatmap</div>
        <div className="heatmap-grid">
          {hourData.map((d) => {
            const intensity = d.count / maxHourly;
            return (
              <div
                key={d.hour}
                className="heatmap-cell"
                title={`${d.hour}:00 — ${d.count} cmds`}
                style={{
                  background: `rgba(0,255,136,${intensity * 0.8 + 0.05})`,
                }}
              >
                <span className="heatmap-hour">{d.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-total">
        Total: {stats.totalCommands} commands
      </div>
    </div>
  );
}
