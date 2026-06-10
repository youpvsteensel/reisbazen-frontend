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
import BarilochePage from './pages/BarilochePage';
import CarreteraAustralPage from './pages/CarreteraAustralPage';
import ElChaltenPage from './pages/ElChaltenPage';
import UshuaiaPage from './pages/UshuaiaPage';
import FalklandsPage from './pages/FalklandsPage';
import PatagonieVolledigheidPage from './pages/PatagonieVolledigheidPage';
import FilipijnenTaiwanJapanPage from './pages/FilipijnenTaiwanJapanPage';
import PortBartonPage from './pages/PortBartonPage';
import ElNidoPage from './pages/ElNidoPage';
import TaoPage from './pages/TaoPage';
import CoronPage from './pages/CoronPage';
import SmangusPage from './pages/SmangusPage';
import TarokoPage from './pages/TarokoPage';
import KumanoKodoPage from './pages/KumanoKodoPage';
import KisoKyotoPage from './pages/KisoKyotoPage';
import ShigaTokyoPage from './pages/ShigaTokyoPage';
import OceaniePage from './pages/OceaniePage';
import MelbournePage from './pages/MelbournePage';
import TasmaniePage from './pages/TasmaniePage';
import WestAustraliePage from './pages/WestAustraliePage';
import NzZuidereilandPage from './pages/NzZuidereilandPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patagonie" element={<PatagoniePage />} />
          <Route path="/patagonie/bariloche" element={<BarilochePage />} />
          <Route path="/patagonie/volledig" element={<PatagonieVolledigheidPage />} />
          <Route path="/patagonie/carretera-austral" element={<CarreteraAustralPage />} />
          <Route path="/patagonie/el-chalten" element={<ElChaltenPage />} />
          <Route path="/patagonie/ushuaia" element={<UshuaiaPage />} />
          <Route path="/patagonie/falklands" element={<FalklandsPage />} />
          <Route path="/filipijnen-taiwan-japan" element={<FilipijnenTaiwanJapanPage />} />
          <Route path="/filipijnen-taiwan-japan/port-barton" element={<PortBartonPage />} />
          <Route path="/filipijnen-taiwan-japan/el-nido" element={<ElNidoPage />} />
          <Route path="/filipijnen-taiwan-japan/tao-expeditie" element={<TaoPage />} />
          <Route path="/filipijnen-taiwan-japan/coron" element={<CoronPage />} />
          <Route path="/filipijnen-taiwan-japan/smangus" element={<SmangusPage />} />
          <Route path="/filipijnen-taiwan-japan/taroko" element={<TarokoPage />} />
          <Route path="/filipijnen-taiwan-japan/kumano-kodo" element={<KumanoKodoPage />} />
          <Route path="/filipijnen-taiwan-japan/kiso-kyoto" element={<KisoKyotoPage />} />
          <Route path="/filipijnen-taiwan-japan/shiga-tokyo" element={<ShigaTokyoPage />} />
          <Route path="/oceanie" element={<OceaniePage />} />
          <Route path="/oceanie/melbourne" element={<MelbournePage />} />
          <Route path="/oceanie/tasmanie" element={<TasmaniePage />} />
          <Route path="/oceanie/west-australie" element={<WestAustraliePage />} />
          <Route path="/oceanie/nz-zuidereiland" element={<NzZuidereilandPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
