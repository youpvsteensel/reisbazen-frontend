import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import PatagoniePage from './pages/PatagoniePage';
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
          <Route path="/patagonie" element={<PatagoniePage />} />
          <Route path="/patagonie/carretera-austral" element={<CarreteraAustralPage />} />
          <Route path="/patagonie/el-chalten" element={<ElChaltenPage />} />
          <Route path="/patagonie/ushuaia" element={<UshuaiaPage />} />
          <Route path="/patagonie/falklands" element={<FalklandsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
