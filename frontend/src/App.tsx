import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { Home } from './pages/Home';
import { FlowBuilder } from './pages/FlowBuilder';
import { Visualizer } from './pages/Visualizer';
import { Migration } from './pages/Migration';
import { DataManager } from './pages/DataManager';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flow-builder" element={<FlowBuilder />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/migration" element={<Migration />} />
        <Route path="/data-manager" element={<DataManager />} />
      </Routes>
    </Layout>
  );
}

export default App;
