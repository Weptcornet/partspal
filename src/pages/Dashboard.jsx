import { useState, useEffect } from 'react';
import {
  Package, AlertTriangle, Users, RotateCcw,
  TrendingUp, Boxes, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../api';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorMap = {
    blue:   'from-emerald-600 to-emerald-400',
    green:  'from-emerald-600 to-emerald-400',
    amber:  'from-amber-600 to-amber-400',
    red:    'from-red-600 to-red-400',
    purple: 'from-purple-600 to-purple-400',
    cyan:   'from-teal-600 to-teal-400',
  };
  const bgMap = {
    blue:   'bg-emerald-500/10',
    green:  'bg-emerald-500/10',
    amber:  'bg-amber-500/10',
    red:    'bg-red-500/10',
    purple: 'bg-purple-500/10',
    cyan:   'bg-teal-500/10',
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgMap[color] || bgMap.blue}`}>
          <Icon className={`w-6 h-6 bg-gradient-to-br ${colorMap[color] || colorMap.blue} bg-clip-text text-emerald-400`} />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/stats').then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return <div className="text-zinc-400">Failed to load dashboard</div>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3 shadow-xl">
          <p className="text-zinc-300 font-medium text-sm">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs mt-1" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Robotics Club Inventory Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Components" value={stats.totalUniqueComponents}
          subtitle={`${stats.totalParts} units across all parts`}
          icon={Package} color="blue"
        />
        <StatCard
          title="Active Issues" value={stats.activeIssues}
          subtitle={`${stats.uniqueMembers} members currently borrowing`}
          icon={Users} color="purple"
        />
        <StatCard
          title="Overdue" value={stats.overdueIssues}
          subtitle={stats.overdueIssues > 0 ? 'Action required' : 'All clear'}
          icon={AlertTriangle} color={stats.overdueIssues > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Returns" value={stats.totalReturned}
          subtitle="Total items returned"
          icon={RotateCcw} color="green"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-3 glass-card rounded-xl p-6 animate-fade-in">
          <h3 className="text-white font-semibold mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.categoryBreakdown} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#27272a' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#27272a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="available" name="Available" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="issued" name="Issued" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 animate-fade-in">
          <h3 className="text-white font-semibold mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.categoryBreakdown}
                dataKey="total"
                nameKey="category"
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {stats.categoryBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs text-zinc-400">{value}</span>}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">Low Stock Alerts</h3>
          </div>
          {stats.lowStockParts.length === 0 ? (
            <p className="text-zinc-500 text-sm">All parts are well-stocked</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockParts.map(part => (
                <div key={part.id} className="flex items-center justify-between py-2 border-b border-zinc-700/50 last:border-0">
                  <div>
                    <p className="text-sm text-zinc-200">{part.name}</p>
                    <p className="text-xs text-zinc-500">{part.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-zinc-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${part.available <= 1 ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${(part.available / part.total) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold min-w-[24px] text-right ${
                      part.available <= 1 ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {part.available}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.action === 'ISSUE' ? 'bg-emerald-400' :
                  item.action === 'RETURN' ? 'bg-emerald-400' :
                  item.action === 'ADD_PART' ? 'bg-purple-400' :
                  item.action === 'DELETE_PART' ? 'bg-red-400' : 'bg-zinc-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 truncate">{item.description}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
