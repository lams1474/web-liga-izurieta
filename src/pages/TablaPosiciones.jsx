import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function TablaPosiciones() {
  const [tabla, setTabla] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [disciplina, setDisciplina] = useState('futbol')
  const [categoria, setCategoria] = useState('hombres')

  useEffect(() => {
    async function cargarTabla() {
      setCargando(true)
      setError(null)

      const { data, error } = await supabase
        .from('vista_tabla_posiciones')
        .select('*')
        .eq('disciplina', disciplina)
        .eq('categoria', categoria)

      if (error) {
        setError(error.message)
        setTabla([])
      } else {
        // Ordenar por puntos desc, dg desc, gf desc
        const ordenada = (data || []).sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts
          if (b.dg !== a.dg) return b.dg - a.dg
          if (b.gf !== a.gf) return b.gf - a.gf
          return a.equipo.localeCompare(b.equipo)
        })
        setTabla(ordenada)
      }
      setCargando(false)
    }

    cargarTabla()
  }, [disciplina, categoria])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-liga-azul mb-6">
        Tabla de Posiciones
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
          <p className="text-gray-500">Cargando tabla...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-liga-rojo rounded-lg shadow p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Tabla */}
      {!cargando && !error && tabla.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500">
            No hay equipos registrados en {disciplina} / {categoria}.
          </p>
        </div>
      )}

      {!cargando && !error && tabla.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-liga-azul text-white">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-3 py-3 text-left text-sm font-semibold">Equipo</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">PJ</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">PG</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">PE</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">PP</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">GF</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">GC</th>
                <th className="px-3 py-3 text-center text-sm font-semibold">DG</th>
                <th className="px-3 py-3 text-center text-sm font-semibold bg-liga-rojo">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((equipo, index) => (
                <tr
                  key={equipo.equipo_id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index === 0 ? 'bg-liga-amarillo/20' : ''
                  }`}
                >
                  <td className="px-3 py-3 font-bold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3 font-semibold text-gray-800">
                    {equipo.equipo}
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-liga-amarillo text-liga-azul px-2 py-1 rounded-full font-bold">
                        LÍDER
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.pj}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.pg}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.pe}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.pp}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.gf}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{equipo.gc}</td>
                  <td className="px-3 py-3 text-center text-gray-700">
                    {equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-liga-azul bg-gray-50">
                    {equipo.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nota de desempate */}
      {!cargando && !error && tabla.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Desempate: Puntos → Diferencia de goles → Goles a favor
        </p>
      )}
    </div>
  )
}

export default TablaPosiciones