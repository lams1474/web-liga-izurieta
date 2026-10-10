import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Goleadores() {
  const [goleadores, setGoleadores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [disciplina, setDisciplina] = useState('futbol')
  const [categoria, setCategoria] = useState('hombres')

  useEffect(() => {
    async function cargarGoleadores() {
      setCargando(true)
      setError(null)

      const { data, error } = await supabase
        .from('vista_goleadores')
        .select('*')
        .eq('disciplina', disciplina)
        .eq('categoria', categoria)

      if (error) {
        setError(error.message)
        setGoleadores([])
      } else {
        // Ordenar por goles desc
        const ordenados = (data || []).sort((a, b) => b.goles - a.goles)
        setGoleadores(ordenados)
      }
      setCargando(false)
    }

    cargarGoleadores()
  }, [disciplina, categoria])

  const medallas = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-liga-azul mb-6">
        Goleadores
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
          <p className="text-gray-500">Cargando goleadores...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-liga-rojo rounded-lg shadow p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Sin goleadores */}
      {!cargando && !error && goleadores.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500">
            No hay goleadores registrados todavía en {disciplina} / {categoria}.
          </p>
        </div>
      )}

      {/* Podio Top 3 */}
      {!cargando && !error && goleadores.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((idx) => {
            const j = goleadores[idx]
            if (!j) return null
            const esPrimero = idx === 0
            return (
              <div
                key={j.id_jugador}
                className={`bg-white rounded-lg shadow-lg p-4 text-center border-t-4 ${
                  esPrimero
                    ? 'border-liga-amarillo md:scale-105'
                    : idx === 1
                    ? 'border-gray-400'
                    : 'border-orange-400'
                }`}
              >
                <div className="text-4xl mb-2">{medallas[idx]}</div>
                <div className="text-lg font-bold text-liga-azul">
                  {j.jugador}
                </div>
                <div className="text-sm text-gray-600 mb-2">{j.equipo}</div>
                <div className="text-3xl font-bold text-liga-rojo">
                  {j.goles}
                </div>
                <div className="text-xs text-gray-500 uppercase">
                  {j.goles === 1 ? 'gol' : 'goles'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tabla completa */}
      {!cargando && !error && goleadores.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-liga-azul text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Jugador</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold bg-liga-rojo">
                  Goles
                </th>
              </tr>
            </thead>
            <tbody>
              {goleadores.map((j, index) => (
                <tr
                  key={j.id_jugador}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index < 3 ? 'bg-liga-amarillo/10' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-gray-700">
                    {index < 3 ? medallas[index] : index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {j.jugador}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{j.equipo}</td>
                  <td className="px-4 py-3 text-center font-bold text-liga-azul bg-gray-50">
                    {j.goles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Goleadores