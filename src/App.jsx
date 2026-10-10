import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import TablaPosiciones from './pages/TablaPosiciones'
import Goleadores from './pages/Goleadores'
import Sancionados from './pages/Sancionados'
import Calendario from './pages/Calendario'
import VerificarCarnet from './pages/VerificarCarnet'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tabla" element={<TablaPosiciones />} />
          <Route path="/goleadores" element={<Goleadores />} />
          <Route path="/sancionados" element={<Sancionados />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/verificar" element={<VerificarCarnet />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App