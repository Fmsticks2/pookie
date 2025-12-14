import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MarketDetail } from './pages/MarketDetail';
import { Portfolio } from './pages/Portfolio';
import { CreateMarket } from './pages/CreateMarket';
import { NotFound } from './pages/NotFound';
import { StaticPage } from './pages/Static';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/create" element={<CreateMarket />} />
          <Route path="/page/:slug" element={<StaticPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;