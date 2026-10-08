import { useState, useEffect } from 'react';
import { Boxes, Plus, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function Kits() {
  const [kits, setKits] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', kitParts: [] });
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get('/api/kits'),
      api.get('/api/parts')
    ]).then(([kitsRes, partsRes]) => {
      setKits(kitsRes.data);
      setParts(partsRes.data);
      setLoading(false);
    });
  }, []);

  const handleAddPart = () => {
    if (!selectedPart) return;
    const existing = form.kitParts.findIndex(p => p.partId === selectedPart);
    if (existing >= 0) {
      const updated = [...form.kitParts];
      updated[existing].quantity += selectedQty;
      setForm({ ...form, kitParts: updated });
    } else {
      setForm({
        ...form,
        kitParts: [...form.kitParts, { partId: selectedPart, quantity: selectedQty }]
      });
    }
    setSelectedPart('');
    setSelectedQty(1);
  };

  const handleRemovePart = (partId) => {
    setForm({ ...form, kitParts: form.kitParts.filter(p => p.partId !== partId) });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.kitParts.length === 0) {
      toast.error('Add at least one part to the kit');
      return;
    }
    try {
      await api.post('/api/kits', form);
      toast.success(`Kit "${form.name}" created!`);
      setShowCreate(false);
      setForm({ name: '', description: '', kitParts: [] });
      const res = await api.get('/api/kits');
      setKits(res.data);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create kit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kit Builder</h1>
          <p className="text-zinc-400 text-sm mt-1">Pre-define kits of parts for quick issuing</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-600/20"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? 'Cancel' : 'Create Kit'}
        </button>
      </div>

      {/* Create Kit Form */}
      {showCreate && (
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">New Kit</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Kit Name</label>
                <input
                  required placeholder="e.g. Smart Home Kit"
                  className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
                <input
                  placeholder="Brief description..."
                  className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Add Parts to Kit</label>
              <div className="flex gap-2">
                <select
                  className="flex-grow p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={selectedPart} onChange={e => setSelectedPart(e.target.value)}
                >
                  <option value="">-- Select a part --</option>
                  {parts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
                <input
                  type="number" min="1" value={selectedQty}
                  onChange={e => setSelectedQty(Number(e.target.value))}
                  className="w-20 p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-center focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
                <button type="button" onClick={handleAddPart}
                  className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 rounded-lg font-medium transition"
                >Add</button>
              </div>
            </div>

            {form.kitParts.length > 0 && (
              <div className="space-y-2">
                {form.kitParts.map(kp => {
                  const part = parts.find(p => p.id === kp.partId);
                  return (
                    <div key={kp.partId} className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5">
                      <span className="text-sm text-white">{part?.name} <span className="text-zinc-500">x{kp.quantity}</span></span>
                      <button type="button" onClick={() => handleRemovePart(kp.partId)} className="text-red-400 hover:text-red-300 text-xs font-medium">Remove</button>
                    </div>
                  );
                })}
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-medium transition shadow-lg shadow-emerald-600/20">
              Create Kit
            </button>
          </form>
        </div>
      )}

      {/* Existing Kits */}
      <div className="grid gap-4 md:grid-cols-2">
        {kits.map((kit, idx) => (
          <div key={kit.id} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{kit.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{kit.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              {kit.parts.map(p => (
                <div key={p.partId} className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-700/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-300">{p.partName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono text-xs">x{p.quantity}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.available >= p.quantity ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {p.available >= p.quantity ? 'Available' : 'Low'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-700/50 text-xs text-zinc-500">
              {kit.parts.length} components · {kit.parts.reduce((s, p) => s + p.quantity, 0)} total items
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kits;
