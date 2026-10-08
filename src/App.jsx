import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Issue from './pages/Issue';
import WhoHasWhat from './pages/WhoHasWhat';
import AuditLog from './pages/AuditLog';
import Kits from './pages/Kits';

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-6 lg:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/kits" element={<Kits />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/who-has-what" element={<WhoHasWhat />} />
          <Route path="/audit-log" element={<AuditLog />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
