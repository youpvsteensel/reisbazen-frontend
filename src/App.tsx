import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import HomePage from './pages/HomePage';
import PatagoniePage from './pages/PatagoniePage';
import CarreteraAustralPage from './pages/CarreteraAustralPage';
import ElChaltenPage from './pages/ElChaltenPage';
import UshuaiaPage from './pages/UshuaiaPage';
import FalklandsPage from './pages/FalklandsPage';
import PatagonieVolledigheidPage from './pages/PatagonieVolledigheidPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patagonie" element={<PatagoniePage />} />
          <Route path="/patagonie/volledig" element={<PatagonieVolledigheidPage />} />
          <Route path="/patagonie/carretera-austral" element={<CarreteraAustralPage />} />
          <Route path="/patagonie/el-chalten" element={<ElChaltenPage />} />
          <Route path="/patagonie/ushuaia" element={<UshuaiaPage />} />
          <Route path="/patagonie/falklands" element={<FalklandsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
