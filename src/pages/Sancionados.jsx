import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Sancionados() {
  const [sancionados, setSancionados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [disciplina, setDisciplina] = useState('futbol')
  const [categoria, setCategoria] = useState('hombres')

  useEffect(() => {
    async function cargarSancionados() {
      setCargando(true)
      setError(null)

      const { data, error } = await supabase
        .from('vista_sancionados')
        .select('*')
        .eq('disciplina', disciplina)
        .eq('categoria', categoria)

      if (error) {
        setError(error.message)
        setSancionados([])
      } else {
        setSancionados(data || [])
      }
      setCargando(false)
    }

    cargarSancionados()
  }, [disciplina, categoria])

  // Configuración visual por tipo de sanción
  const tipoConfig = {
    amarilla: {
      label: 'Amarilla',
      emoji: '🟨',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    },
    roja: {
      label: 'Roja directa',
      emoji: '🟥',
      color: 'bg-red-100 border-red-500 text-red-800',
    },
    doble_amarilla: {
      label: 'Doble amarilla',
      emoji: '🟥🟨',
      color: 'bg-orange-100 border-orange-500 text-orange-800',
    },
    suspension_admin: {
      label: 'Suspensión administrativa',
      emoji: '⚖️',
      color: 'bg-gray-100 border-gray-500 text-gray-800',
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-liga-azul mb-6">
        Sancionados
      </h1>

      {/* Selectores */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Disciplina:</label>
          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liga-azul"
          >
            <option value="futbol">Fútbol</option>
            <option value="futsala">Futsala</option>
            <option value="ecuavoly">Ecuavoly</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Categoría:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liga-azul"
          >
            <option value="hombres">Hombres</option>
            <option value="mujeres">Mujeres</option>
            <option value="sub12">Sub-12</option>
          </select>
        </div>
      </div>

      {/* Estado de carga / error */}
      {cargando && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500">Cargando sancionados...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-liga-rojo rounded-lg shadow p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Sin sancionados */}
      {!cargando && !error && sancionados.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">
            No hay sancionados activos
          </h2>
          <p className="text-gray-500">
            Todos los jugadores de {disciplina} / {categoria} están habilitados.
          </p>
        </div>
      )}

      {/* Lista de sancionados */}
      {!cargando && !error && sancionados.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Total: <strong>{sancionados.length}</strong> jugador
            {sancionados.length !== 1 ? 'es' : ''} sancionado
            {sancionados.length !== 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sancionados.map((s) => {
              const config = tipoConfig[s.tipo] || tipoConfig.amarilla
              const pendientes = s.fechas_sancion - s.fechas_cumplidas

              return (
                <div
                  key={`${s.jugador_id}-${s.tipo}-${s.fecha_inicio}`}
                  className={`bg-white rounded-lg shadow-lg p-5 border-l-4 ${config.color}`}
                >
                  {/* Encabezado */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {s.jugador}
                      </h3>
                      <p className="text-sm text-gray-600">{s.equipo}</p>
                    </div>
                    <div className="text-3xl">{config.emoji}</div>
                  </div>

                  {/* Motivo */}
                  <div className="bg-white/50 rounded p-3 mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Motivo:
                    </p>
                    <p className="text-sm text-gray-600">{s.motivo}</p>
                  </div>

                  {/* Detalles */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Tipo</p>
                      <p className="font-semibold text-gray-800">
                        {config.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Fechas pendientes</p>
                      <p className="font-bold text-liga-rojo text-lg">
                        {pendientes}
                      </p>
                    </div>
                  </div>

                  {/* Fecha inicio */}
                  {s.fecha_inicio && (
                    <p className="text-xs text-gray-500 mt-3">
                      Desde: {new Date(s.fecha_inicio).toLocaleDateString('es-EC')}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Sancionados