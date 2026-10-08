const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// IN-MEMORY DATABASE
// ============================================================
let parts = [
  { id: 'p1',  name: 'Arduino Uno R3',          category: 'Microcontroller', total: 15, available: 12 },
  { id: 'p2',  name: 'Arduino Nano',             category: 'Microcontroller', total: 10, available: 10 },
  { id: 'p3',  name: 'ESP32 DevKit',             category: 'Microcontroller', total: 8,  available: 5  },
  { id: 'p4',  name: 'Raspberry Pi 4B',          category: 'SBC',             total: 5,  available: 2  },
  { id: 'p5',  name: 'Raspberry Pi Pico',        category: 'Microcontroller', total: 12, available: 12 },
  { id: 'p6',  name: 'IR Sensor Module',         category: 'Sensor',          total: 30, available: 24 },
  { id: 'p7',  name: 'Ultrasonic HC-SR04',       category: 'Sensor',          total: 20, available: 15 },
  { id: 'p8',  name: 'DHT11 Temp & Humidity',    category: 'Sensor',          total: 15, available: 15 },
  { id: 'p9',  name: 'MQ-2 Gas Sensor',          category: 'Sensor',          total: 8,  available: 8  },
  { id: 'p10', name: 'MPU6050 Gyroscope',        category: 'Sensor',          total: 6,  available: 3  },
  { id: 'p11', name: 'L298N Motor Driver',       category: 'Driver',          total: 10, available: 7  },
  { id: 'p12', name: 'L293D Motor Shield',       category: 'Driver',          total: 8,  available: 8  },
  { id: 'p13', name: 'Servo Motor SG90',         category: 'Actuator',        total: 25, available: 20 },
  { id: 'p14', name: 'DC Motor 6V',              category: 'Actuator',        total: 20, available: 16 },
  { id: 'p15', name: 'Stepper Motor 28BYJ-48',   category: 'Actuator',        total: 6,  available: 6  },
  { id: 'p16', name: 'Jumper Wires M-M (40pc)',  category: 'Passive',         total: 30, available: 25 },
  { id: 'p17', name: 'Jumper Wires M-F (40pc)',  category: 'Passive',         total: 30, available: 28 },
  { id: 'p18', name: 'Breadboard 830-point',     category: 'Passive',         total: 20, available: 15 },
  { id: 'p19', name: 'Resistor Kit (600pc)',      category: 'Passive',         total: 10, available: 10 },
  { id: 'p20', name: 'LED Assortment Pack',      category: 'Passive',         total: 15, available: 15 },
  { id: 'p21', name: 'LiPo Battery 3.7V 1800mAh',category: 'Power',          total: 12, available: 8  },
  { id: 'p22', name: '9V Battery Snap Connector', category: 'Power',          total: 20, available: 20 },
  { id: 'p23', name: 'Buck Converter LM2596',    category: 'Power',           total: 8,  available: 8  },
  { id: 'p24', name: 'OLED Display 0.96in',      category: 'Display',         total: 10, available: 7  },
  { id: 'p25', name: 'LCD 16x2 I2C',             category: 'Display',         total: 8,  available: 5  },
];

let kits = [
  {
    id: 'k1', name: 'Line Follower Bot',
    description: 'Complete line-following robot kit with sensors and motor driver',
    parts: [
      { partId: 'p1', quantity: 1 },
      { partId: 'p6', quantity: 3 },
      { partId: 'p11', quantity: 1 },
      { partId: 'p14', quantity: 2 },
      { partId: 'p18', quantity: 1 },
      { partId: 'p16', quantity: 1 },
    ]
  },
  {
    id: 'k2', name: 'Obstacle Avoider Bot',
    description: 'Autonomous obstacle-avoiding robot with ultrasonic sensors',
    parts: [
      { partId: 'p1', quantity: 1 },
      { partId: 'p7', quantity: 2 },
      { partId: 'p11', quantity: 1 },
      { partId: 'p14', quantity: 2 },
      { partId: 'p13', quantity: 1 },
      { partId: 'p16', quantity: 1 },
    ]
  },
  {
    id: 'k3', name: 'IoT Weather Station',
    description: 'Wi-Fi connected weather monitoring station',
    parts: [
      { partId: 'p3', quantity: 1 },
      { partId: 'p8', quantity: 1 },
      { partId: 'p24', quantity: 1 },
      { partId: 'p18', quantity: 1 },
      { partId: 'p16', quantity: 1 },
    ]
  },
  {
    id: 'k4', name: 'Robotic Arm Starter',
    description: 'Basic robotic arm with servo motors and controller',
    parts: [
      { partId: 'p1', quantity: 1 },
      { partId: 'p13', quantity: 4 },
      { partId: 'p10', quantity: 1 },
      { partId: 'p25', quantity: 1 },
      { partId: 'p17', quantity: 1 },
    ]
  },
];

let issues = [
  {
    id: 'iss-1',
    memberName: 'Arjun Mehta',
    regNo: 'RA2211003010045',
    dueDate: '2026-10-05',
    items: [{ partId: 'p1', quantity: 1 }, { partId: 'p6', quantity: 3 }, { partId: 'p11', quantity: 1 }],
    kitId: null, kitName: null,
    returned: false,
    issuedAt: '2026-10-01T10:30:00.000Z'
  },
  {
    id: 'iss-2',
    memberName: 'Priya Sharma',
    regNo: 'RA2211003010102',
    dueDate: '2026-10-10',
    items: [{ partId: 'p3', quantity: 1 }, { partId: 'p8', quantity: 1 }, { partId: 'p24', quantity: 1 }],
    kitId: 'k3', kitName: 'IoT Weather Station',
    returned: false,
    issuedAt: '2026-10-03T14:15:00.000Z'
  },
  {
    id: 'iss-3',
    memberName: 'Rahul Verma',
    regNo: 'RA2211003010078',
    dueDate: '2026-10-06',
    items: [{ partId: 'p4', quantity: 1 }, { partId: 'p16', quantity: 1 }],
    kitId: null, kitName: null,
    returned: false,
    issuedAt: '2026-10-02T09:00:00.000Z'
  },
  {
    id: 'iss-4',
    memberName: 'Sneha Nair',
    regNo: 'RA2211003010156',
    dueDate: '2026-10-12',
    items: [{ partId: 'p13', quantity: 2 }, { partId: 'p7', quantity: 1 }],
    kitId: null, kitName: null,
    returned: false,
    issuedAt: '2026-10-05T11:45:00.000Z'
  },
];

let auditLog = [
  { id: 'a1', action: 'ISSUE', description: 'Issued 3 parts to Arjun Mehta (RA2211003010045)', timestamp: '2026-10-01T10:30:00.000Z' },
  { id: 'a2', action: 'ISSUE', description: 'Issued IoT Weather Station kit to Priya Sharma (RA2211003010102)', timestamp: '2026-10-03T14:15:00.000Z' },
  { id: 'a3', action: 'ISSUE', description: 'Issued 2 parts to Rahul Verma (RA2211003010078)', timestamp: '2026-10-02T09:00:00.000Z' },
  { id: 'a4', action: 'ISSUE', description: 'Issued 2 parts to Sneha Nair (RA2211003010156)', timestamp: '2026-10-05T11:45:00.000Z' },
];

// ============================================================
// HELPER
// ============================================================
function addAudit(action, description) {
  auditLog.unshift({ id: uuidv4(), action, description, timestamp: new Date().toISOString() });
}

function getCategories() {
  return [...new Set(parts.map(p => p.category))].sort();
}

// ============================================================
// ROUTES: DASHBOARD / STATS
// ============================================================
app.get('/api/stats', (req, res) => {
  const totalParts = parts.reduce((sum, p) => sum + p.total, 0);
  const totalAvailable = parts.reduce((sum, p) => sum + p.available, 0);
  const totalIssued = totalParts - totalAvailable;
  const activeIssues = issues.filter(i => !i.returned).length;
  const now = new Date();
  const overdueIssues = issues.filter(i => !i.returned && new Date(i.dueDate) < now).length;
  const totalReturned = issues.filter(i => i.returned).length;
  const uniqueMembers = new Set(issues.filter(i => !i.returned).map(i => i.regNo)).size;

  // Category breakdown
  const categoryBreakdown = getCategories().map(cat => {
    const catParts = parts.filter(p => p.category === cat);
    return {
      category: cat,
      total: catParts.reduce((s, p) => s + p.total, 0),
      available: catParts.reduce((s, p) => s + p.available, 0),
      issued: catParts.reduce((s, p) => s + (p.total - p.available), 0),
    };
  });

  // Low stock parts (available <= 3)
  const lowStockParts = parts.filter(p => p.available <= 3 && p.available > 0)
    .sort((a, b) => a.available - b.available)
    .slice(0, 8);

  // Out of stock
  const outOfStockParts = parts.filter(p => p.available === 0);

  // Recent activity
  const recentActivity = auditLog.slice(0, 10);

  res.json({
    totalParts, totalAvailable, totalIssued, activeIssues,
    overdueIssues, totalReturned, uniqueMembers,
    categoryBreakdown, lowStockParts, outOfStockParts, recentActivity,
    totalUniqueComponents: parts.length,
    totalKits: kits.length,
  });
});

// ============================================================
// ROUTES: PARTS
// ============================================================
app.get('/api/parts', (req, res) => {
  let filtered = parts;
  const { category, search } = req.query;
  if (category) filtered = filtered.filter(p => p.category === category);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  res.json(filtered);
});

app.get('/api/parts/categories', (req, res) => {
  res.json(getCategories());
});

app.post('/api/parts', (req, res) => {
  const { name, category, total } = req.body;
  if (!name || !category || !total) return res.status(400).json({ error: 'Name, category, and total are required' });
  const newPart = { id: uuidv4(), name, category, total: Number(total), available: Number(total) };
  parts.push(newPart);
  addAudit('ADD_PART', `Added new part: ${name} (${category}) x${total}`);
  res.status(201).json(newPart);
});

app.put('/api/parts/:id', (req, res) => {
  const part = parts.find(p => p.id === req.params.id);
  if (!part) return res.status(404).json({ error: 'Part not found' });
  const { name, category, total } = req.body;
  const oldName = part.name;
  if (name) part.name = name;
  if (category) part.category = category;
  if (total !== undefined) {
    const diff = Number(total) - part.total;
    part.total = Number(total);
    part.available = Math.max(0, part.available + diff);
  }
  addAudit('EDIT_PART', `Updated part: ${oldName} → ${part.name}`);
  res.json(part);
});

app.delete('/api/parts/:id', (req, res) => {
  const idx = parts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Part not found' });
  const [removed] = parts.splice(idx, 1);
  addAudit('DELETE_PART', `Deleted part: ${removed.name}`);
  res.json({ success: true });
});

// ============================================================
// ROUTES: KITS
// ============================================================
app.get('/api/kits', (req, res) => {
  // Populate part names into kit response
  const populated = kits.map(kit => ({
    ...kit,
    parts: kit.parts.map(kp => ({
      ...kp,
      partName: parts.find(p => p.id === kp.partId)?.name || 'Unknown',
      available: parts.find(p => p.id === kp.partId)?.available || 0,
    }))
  }));
  res.json(populated);
});

app.post('/api/kits', (req, res) => {
  const { name, description, kitParts } = req.body;
  if (!name || !kitParts || kitParts.length === 0) return res.status(400).json({ error: 'Name and parts are required' });
  const newKit = { id: uuidv4(), name, description: description || '', parts: kitParts };
  kits.push(newKit);
  addAudit('ADD_KIT', `Created new kit: ${name}`);
  res.status(201).json(newKit);
});

// ============================================================
// ROUTES: ISSUES
// ============================================================
app.post('/api/issues', (req, res) => {
  const { memberName, regNo, dueDate, items, kitId } = req.body;

  let resolvedItems = items || [];
  let kitName = null;

  if (kitId) {
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return res.status(404).json({ error: 'Kit not found' });
    resolvedItems = kit.parts;
    kitName = kit.name;
  }

  if (resolvedItems.length === 0) return res.status(400).json({ error: 'No items selected' });
  if (!memberName || !regNo || !dueDate) return res.status(400).json({ error: 'Member name, reg no, and due date are required' });

  // ALL-OR-NOTHING stock check
  for (const item of resolvedItems) {
    const part = parts.find(p => p.id === item.partId);
    if (!part) return res.status(400).json({ error: `Part ${item.partId} not found` });
    if (part.available < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${part.name}. Need ${item.quantity}, only ${part.available} available.`
      });
    }
  }

  // Deduct
  for (const item of resolvedItems) {
    const part = parts.find(p => p.id === item.partId);
    part.available -= item.quantity;
  }

  const issue = {
    id: uuidv4(), memberName, regNo, dueDate,
    items: resolvedItems,
    kitId: kitId || null, kitName,
    returned: false, returnedAt: null,
    issuedAt: new Date().toISOString()
  };
  issues.push(issue);

  const desc = kitId
    ? `Issued ${kitName} kit to ${memberName} (${regNo})`
    : `Issued ${resolvedItems.length} part(s) to ${memberName} (${regNo})`;
  addAudit('ISSUE', desc);

  res.status(201).json(issue);
});

app.patch('/api/issues/:id/return', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  if (issue.returned) return res.status(400).json({ error: 'Already returned' });

  issue.returned = true;
  issue.returnedAt = new Date().toISOString();

  for (const item of issue.items) {
    const part = parts.find(p => p.id === item.partId);
    if (part) part.available += item.quantity;
  }

  addAudit('RETURN', `${issue.memberName} (${issue.regNo}) returned ${issue.kitName || issue.items.length + ' part(s)'}`);
  res.json(issue);
});

app.get('/api/issues', (req, res) => {
  const { status } = req.query;
  let filtered = issues;
  const now = new Date();

  if (status === 'overdue') {
    filtered = issues.filter(i => !i.returned && new Date(i.dueDate) < now);
  } else if (status === 'active') {
    filtered = issues.filter(i => !i.returned);
  } else if (status === 'returned') {
    filtered = issues.filter(i => i.returned);
  }

  const populated = filtered.map(issue => ({
    ...issue,
    items: issue.items.map(item => ({
      ...item,
      partName: parts.find(p => p.id === item.partId)?.name || 'Unknown Part'
    }))
  }));

  populated.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  res.json(populated);
});

// ============================================================
// ROUTES: AUDIT LOG
// ============================================================
app.get('/api/audit-log', (req, res) => {
  res.json(auditLog);
});

// ============================================================
// START
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PartsPal API running on port ${PORT}`));
