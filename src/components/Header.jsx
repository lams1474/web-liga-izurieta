import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import escudo from '../assets/escudo-liga.png'

function Header() {
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const menu = [
    { path: '/', label: 'Inicio' },
    { path: '/tabla', label: 'Tabla' },
    { path: '/goleadores', label: 'Goleadores' },
    { path: '/sancionados', label: 'Sancionados' },
    { path: '/calendario', label: 'Calendario' },
    { path: '/verificar', label: 'Verificar Carnet' },
  ]

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="bg-liga-azul text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Nombre */}
        <Link to="/" className="flex items-center gap-3" onClick={cerrarMenu}>
          <img 
            src={escudo} 
            alt="Escudo Liga" 
            className="w-14 h-14 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold leading-tight">
              Liga José I. Izurieta
            </h1>
            <p className="text-xs text-liga-amarillo">
              Deportiva Barrial
            </p>
          </div>
        </Link>

        {/* Menú desktop */}
        <nav className="hidden md:flex gap-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-liga-rojo text-white'
                  : 'hover:bg-liga-rojo/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botón hamburguesa (móvil) */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-3xl focus:outline-none"
          aria-label="Abrir menú"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {menuAbierto && (
        <nav className="md:hidden bg-liga-azul border-t border-white/20">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={cerrarMenu}
              className={`block px-4 py-3 text-sm font-medium border-b border-white/10 transition-colors ${
                location.pathname === item.path
                  ? 'bg-liga-rojo text-white'
                  : 'hover:bg-liga-rojo/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header