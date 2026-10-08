import { useState, useEffect } from 'react';
import { FileText, Package, RotateCcw, Plus, Trash2, Pencil, Boxes } from 'lucide-react';
import api from '../api';

const actionConfig = {
  ISSUE:       { icon: Package,  color: 'text-emerald-400',    bg: 'bg-emerald-500/10',    label: 'Issue' },
  RETURN:      { icon: RotateCcw, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Return' },
  ADD_PART:    { icon: Plus,     color: 'text-purple-400',  bg: 'bg-purple-500/10',  label: 'Add Part' },
  EDIT_PART:   { icon: Pencil,   color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'Edit Part' },
  DELETE_PART: { icon: Trash2,   color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Delete Part' },
  ADD_KIT:     { icon: Boxes,    color: 'text-teal-400',    bg: 'bg-teal-500/10',    label: 'New Kit' },
};

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/audit-log').then(res => {
      setLogs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-zinc-400 text-sm mt-1">Complete history of all inventory operations</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-700/50 text-xs font-medium text-zinc-400 uppercase tracking-wider">
          <div className="col-span-2">Action</div>
          <div className="col-span-7">Description</div>
          <div className="col-span-3 text-right">Timestamp</div>
        </div>

        {/* Rows */}
        {logs.map((log, idx) => {
          const config = actionConfig[log.action] || { icon: FileText, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: log.action };
          const Icon = config.icon;
          return (
            <div
              key={log.id}
              className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-zinc-700/30 last:border-0 hover:bg-zinc-800/50 transition animate-slide-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>
              <div className="col-span-7 text-sm text-zinc-300 flex items-center">
                {log.description}
              </div>
              <div className="col-span-3 text-sm text-zinc-500 flex items-center justify-end">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            No audit records yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLog;
