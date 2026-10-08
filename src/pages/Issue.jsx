import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SendHorizontal, Package, Boxes, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function Issue() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState('kit');
  const [kits, setKits] = useState([]);
  const [parts, setParts] = useState([]);
  const [step, setStep] = useState(1); // 1: member info, 2: select items, 3: review

  const [formData, setFormData] = useState({
    memberName: '', regNo: '', dueDate: '',
    kitId: '', items: []
  });
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/kits').then(res => setKits(res.data));
    api.get('/api/parts').then(res => setParts(res.data));
  }, []);

  const handleAddPart = () => {
    if (!selectedPart) return;
    const existingIndex = formData.items.findIndex(i => i.partId === selectedPart);
    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += selectedQty;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { partId: selectedPart, quantity: selectedQty }]
      });
    }
    setSelectedPart('');
    setSelectedQty(1);
  };

  const handleRemovePart = (partId) => {
    setFormData({ ...formData, items: formData.items.filter(i => i.partId !== partId) });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        memberName: formData.memberName,
        regNo: formData.regNo,
        dueDate: formData.dueDate,
        kitId: issueType === 'kit' ? formData.kitId : null,
        items: issueType === 'parts' ? formData.items : []
      };
      await api.post('/api/issues', payload);
      toast.success('Items issued successfully!');
      navigate('/who-has-what');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue items');
      toast.error(err.response?.data?.error || 'Failed to issue items');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.memberName && formData.regNo && formData.dueDate;
  const canProceedStep2 = issueType === 'kit' ? !!formData.kitId : formData.items.length > 0;

  const selectedKit = kits.find(k => k.id === formData.kitId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Issue Items</h1>
        <p className="text-zinc-400 text-sm mt-1">Issue parts or kits to club members</p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-2">
        {[{ n: 1, label: 'Member Info' }, { n: 2, label: 'Select Items' }, { n: 3, label: 'Review' }].map((s, idx) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 flex-1 ${
              step >= s.n ? 'text-emerald-400' : 'text-zinc-600'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                step > s.n ? 'bg-emerald-600 border-emerald-600 text-white' :
                step === s.n ? 'border-emerald-500 text-emerald-400' :
                'border-zinc-700 text-zinc-600'
              }`}>
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {idx < 2 && <ChevronRight className={`w-4 h-4 flex-shrink-0 ${step > s.n ? 'text-emerald-400' : 'text-zinc-700'}`} />}
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 animate-fade-in">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Member Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-white mb-4">Member Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Member Name</label>
                <input
                  type="text" required placeholder="e.g. Arjun Mehta"
                  className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={formData.memberName}
                  onChange={e => setFormData({...formData, memberName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Registration No.</label>
                <input
                  type="text" required placeholder="e.g. RA2211003010045"
                  className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={formData.regNo}
                  onChange={e => setFormData({...formData, regNo: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Return Due Date</label>
              <input
                type="date" required
                className="w-full p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div className="pt-2 flex justify-end">
              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Items */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-white mb-2">Select Items to Issue</h2>

            {/* Toggle */}
            <div className="flex bg-zinc-700/50 p-1 rounded-lg">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${
                  issueType === 'kit' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
                onClick={() => setIssueType('kit')}
              >
                <Boxes className="w-4 h-4" /> Issue a Kit
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${
                  issueType === 'parts' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
                onClick={() => setIssueType('parts')}
              >
                <Package className="w-4 h-4" /> Individual Parts
              </button>
            </div>

            {issueType === 'kit' ? (
              <div className="space-y-3">
                {kits.map(kit => (
                  <div
                    key={kit.id}
                    onClick={() => setFormData({...formData, kitId: kit.id})}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.kitId === kit.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{kit.name}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">{kit.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.kitId === kit.id ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'
                      }`}>
                        {formData.kitId === kit.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {kit.parts.map(p => (
                        <span key={p.partId} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                          {p.partName} x{p.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    className="flex-grow p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    value={selectedPart} onChange={e => setSelectedPart(e.target.value)}
                  >
                    <option value="">-- Choose a part --</option>
                    {parts.filter(p => p.available > 0).map(part => (
                      <option key={part.id} value={part.id}>{part.name} ({part.available} avail)</option>
                    ))}
                  </select>
                  <input
                    type="number" min="1" value={selectedQty}
                    onChange={e => setSelectedQty(Number(e.target.value))}
                    className="w-20 p-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-center focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  />
                  <button
                    type="button" onClick={handleAddPart}
                    className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 rounded-lg font-medium transition"
                  >
                    Add
                  </button>
                </div>

                {formData.items.length > 0 && (
                  <div className="space-y-2">
                    {formData.items.map(item => {
                      const part = parts.find(p => p.id === item.partId);
                      return (
                        <div key={item.partId} className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5">
                          <div>
                            <span className="text-sm text-white">{part?.name}</span>
                            <span className="text-zinc-500 ml-2">x{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => handleRemovePart(item.partId)}
                            className="text-red-400 hover:text-red-300 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white px-4 py-2.5 rounded-lg transition">
                Back
              </button>
              <button
                disabled={!canProceedStep2}
                onClick={() => { setError(''); setStep(3); }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-white mb-4">Review & Confirm</h2>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500">Member</span>
                  <p className="text-white font-medium">{formData.memberName}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Reg No.</span>
                  <p className="text-white font-medium">{formData.regNo}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Due Date</span>
                  <p className="text-white font-medium">{formData.dueDate}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Type</span>
                  <p className="text-white font-medium">{issueType === 'kit' ? `Kit: ${selectedKit?.name}` : 'Individual Parts'}</p>
                </div>
              </div>

              <hr className="border-zinc-700" />

              <div>
                <span className="text-zinc-500 text-sm">Items being issued:</span>
                <div className="mt-2 space-y-1.5">
                  {issueType === 'kit' && selectedKit ? (
                    selectedKit.parts.map(p => (
                      <div key={p.partId} className="flex justify-between text-sm">
                        <span className="text-zinc-300">{p.partName}</span>
                        <span className="text-zinc-500">x{p.quantity}</span>
                      </div>
                    ))
                  ) : (
                    formData.items.map(item => {
                      const part = parts.find(p => p.id === item.partId);
                      return (
                        <div key={item.partId} className="flex justify-between text-sm">
                          <span className="text-zinc-300">{part?.name}</span>
                          <span className="text-zinc-500">x{item.quantity}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-white px-4 py-2.5 rounded-lg transition">
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg shadow-emerald-600/20"
              >
                <SendHorizontal className="w-4 h-4" />
                {loading ? 'Processing...' : 'Confirm & Issue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Issue;
