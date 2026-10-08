import { useState, useEffect } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { AlertCircle, CheckCircle, Package, Clock, User, Boxes, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function WhoHasWhat() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => { fetchIssues(); }, [filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/issues?status=${filter}`);
      setIssues(res.data);
    } catch (error) {
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id, name) => {
    try {
      await api.patch(`/api/issues/${id}/return`);
      toast.success(`${name}'s items marked as returned`);
      fetchIssues();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark as returned');
    }
  };

  const filters = [
    { key: 'active',   label: 'Active',   icon: Clock },
    { key: 'overdue',  label: 'Overdue',  icon: AlertCircle },
    { key: 'returned', label: 'Returned', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Who Has What</h1>
          <p className="text-zinc-400 text-sm mt-1">Track all issued items and returns</p>
        </div>

        <div className="flex bg-zinc-800 p-1 rounded-lg border border-zinc-700">
          {filters.map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === f.key
                    ? f.key === 'overdue' ? 'bg-red-600/20 text-red-400 shadow-sm' : 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                onClick={() => setFilter(f.key)}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : issues.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <Package className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400">No records found for this filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue, idx) => {
            const dueDate = parseISO(issue.dueDate);
            const isOverdue = !issue.returned && isPast(dueDate);

            return (
              <div
                key={issue.id}
                className={`glass-card rounded-xl overflow-hidden animate-fade-in ${
                  isOverdue ? 'border-red-500/40' : issue.returned ? 'border-emerald-500/20' : ''
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Status bar */}
                <div className={`h-1 ${
                  isOverdue ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  issue.returned ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                  'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isOverdue ? 'bg-red-500/10 text-red-400' :
                        issue.returned ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {issue.memberName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{issue.memberName}</h3>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> {issue.regNo}
                        </p>
                      </div>
                    </div>

                    {isOverdue && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full animate-pulse-glow">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                    {issue.returned && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Returned
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 mb-4 text-xs">
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      Issued: {format(parseISO(issue.issuedAt), 'MMM d, yyyy')}
                    </span>
                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : 'text-zinc-500'}`}>
                      <Clock className="w-3 h-3" />
                      Due: {format(dueDate, 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-zinc-400 font-medium">
                      {issue.kitId ? <Boxes className="w-3.5 h-3.5 text-teal-400" /> : <Package className="w-3.5 h-3.5 text-emerald-400" />}
                      {issue.kitId ? `Kit: ${issue.kitName}` : 'Individual Parts'}
                    </div>
                    <div className="space-y-1">
                      {issue.items.map(item => (
                        <div key={item.partId} className="flex justify-between text-sm">
                          <span className="text-zinc-300">{item.partName}</span>
                          <span className="text-zinc-500 font-mono">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Return button */}
                  {!issue.returned && (
                    <button
                      onClick={() => handleReturn(issue.id, issue.memberName)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Returned
                    </button>
                  )}
                  {issue.returned && issue.returnedAt && (
                    <p className="mt-3 text-xs text-zinc-500 text-center">
                      Returned on {format(parseISO(issue.returnedAt), 'MMM d, yyyy \u0061\u0074 h:mm a')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WhoHasWhat;
