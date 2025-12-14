import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { MarketDetail } from '@/pages/MarketDetail'
import { Portfolio } from '@/pages/Portfolio'
import { CreateMarket } from '@/pages/CreateMarket'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/create" element={<CreateMarket />} />
      </Routes>
    </Layout>
  )
}

export default App
