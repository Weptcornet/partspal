import { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Plus, X, Pencil, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Inventory() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', total: '' });

  useEffect(() => {
    api.get('/api/parts/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchParts();
  }, [search, category]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const res = await api.get(`/api/parts?${params}`);
      setParts(res.data);
    } catch (e) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/parts', form);
      toast.success(`Added ${form.name} to inventory`);
      setShowAddModal(false);
      setForm({ name: '', category: '', total: '' });
      fetchParts();
      api.get('/api/parts/categories').then(res => setCategories(res.data));
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to add part');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/parts/${editingPart.id}`, form);
      toast.success(`Updated ${form.name}`);
      setEditingPart(null);
      setForm({ name: '', category: '', total: '' });
      fetchParts();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to update');
    }
  };

  const handleDelete = async (part) => {
    if (!confirm(`Delete ${part.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/parts/${part.id}`);
      toast.success(`Deleted ${part.name}`);
      fetchParts();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (part) => {
    setForm({ name: part.name, category: part.category, total: part.total });
    setEditingPart(part);
  };

  const getStockLevel = (part) => {
    const pct = part.total > 0 ? (part.available / part.total) * 100 : 0;
    if (part.available === 0) return { label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500', barColor: 'bg-red-500' };
    if (pct <= 20) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', barColor: 'bg-red-500' };
    if (pct <= 40) return { label: 'Low Stock', color: 'text-amber-400', bg: 'bg-amber-500/10', barColor: 'bg-amber-500' };
    return { label: 'In Stock', color: 'text-emerald-400', bg: 'bg-emerald-500/10', barColor: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-zinc-400 text-sm mt-1">{parts.length} components in catalog</p>
        </div>
        <button
          onClick={() => { setForm({ name: '', category: '', total: '' }); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" /> Add Component
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="text" placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500 w-4 h-4" />
          <select
            className="pl-10 pr-8 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
            value={category} onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {parts.map((part, idx) => {
            const stock = getStockLevel(part);
            const pct = part.total > 0 ? (part.available / part.total) * 100 : 0;
            return (
              <div
                key={part.id}
                className="glass-card rounded-xl p-5 hover:border-zinc-600 transition-all duration-200 group animate-fade-in"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                      <Package className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100 text-sm">{part.name}</h3>
                      <span className="text-xs text-zinc-500">{part.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(part)} className="p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(part)} className="p-1.5 rounded-md hover:bg-red-900/30 text-zinc-400 hover:text-red-400 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stock bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-medium ${stock.color}`}>{stock.label}</span>
                    <span className="text-xs text-zinc-500">{part.available} / {part.total}</span>
                  </div>
                  <div className="w-full bg-zinc-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${stock.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Warning */}
                {part.available === 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-red-400 text-xs animate-pulse-glow rounded-md px-2 py-1 bg-red-500/5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="font-medium">Out of stock — restocking needed</span>
                  </div>
                )}
              </div>
            );
          })}
          {parts.length === 0 && (
            <div className="col-span-full glass-card rounded-xl p-12 text-center text-zinc-500">
              No components found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Component">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Component Name</label>
            <input required className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Category</label>
            <input required placeholder="e.g. Sensor, Actuator, Passive" className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Total Quantity</label>
            <input required type="number" min="1" className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.total} onChange={e => setForm({...form, total: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-medium transition shadow-lg shadow-emerald-600/20">
            Add to Inventory
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingPart} onClose={() => setEditingPart(null)} title="Edit Component">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Component Name</label>
            <input required className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Category</label>
            <input required className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Total Quantity</label>
            <input required type="number" min="1" className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" value={form.total} onChange={e => setForm({...form, total: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-medium transition shadow-lg shadow-emerald-600/20">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;
