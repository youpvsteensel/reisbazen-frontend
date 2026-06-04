import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import CarreteraAustralPage from './pages/CarreteraAustralPage';
import ElChaltenPage from './pages/ElChaltenPage';
import UshuaiaPage from './pages/UshuaiaPage';
import FalklandsPage from './pages/FalklandsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/carretera-austral" element={<CarreteraAustralPage />} />
          <Route path="/el-chalten" element={<ElChaltenPage />} />
          <Route path="/ushuaia" element={<UshuaiaPage />} />
          <Route path="/falklands" element={<FalklandsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
