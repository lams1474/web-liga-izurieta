import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Calendario() {
  const [partidos, setPartidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [disciplina, setDisciplina] = useState('futbol')
  const [categoria, setCategoria] = useState('hombres')
  const [vista, setVista] = useState('proximos') // 'proximos' o 'resultados'

  useEffect(() => {
    async function cargarPartidos() {
      setCargando(true)
      setError(null)

      // Traer todos los partidos de la disciplina/categoría
      const { data, error } = await supabase
        .from('partidos')
        .select(`
          id,
          hora,
          cancha,
          goles_local,
          goles_visitante,
          jugado,
          creado_en,
          equipo_local:equipos!partidos_equipo_local_id_fkey (
            id,
            nombre,
            disciplina,
            categoria
          ),
          equipo_visitante:equipos!partidos_equipo_visitante_id_fkey (
            id,
            nombre,
            disciplina,
            categoria
          ),
          fecha:fechas!partidos_fecha_id_fkey (
            id,
            numero,
            fecha_inicio,
            fecha_fin,
            etapa:etapas!fechas_etapa_id_fkey (
              id,
              nombre,
              disciplina,
              categoria
            )
          )
        `)
        .order('creado_en', { ascending: false })

      if (error) {
        setError(error.message)
        setPartidos([])
        setCargando(false)
        return
      }

      // Filtrar por disciplina y categoría del equipo local
      const filtrados = (data || []).filter(
        (p) =>
          p.equipo_local?.disciplina === disciplina &&
          p.equipo_local?.categoria === categoria
      )

      setPartidos(filtrados)
      setCargando(false)
    }

    cargarPartidos()
  }, [disciplina, categoria])

  // Separar por estado
  const proximos = partidos.filter((p) => !p.jugado)
  const resultados = partidos.filter((p) => p.jugado)

  const partidosMostrados = vista === 'proximos' ? proximos : resultados

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return ''
    const fecha = new Date(fechaISO + 'T00:00:00')
    return fecha.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-liga-azul mb-6">Calendario</h1>

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

      {/* Pestañas */}
      <div className="bg-white rounded-lg shadow-lg mb-6 flex overflow-hidden">
        <button
          onClick={() => setVista('proximos')}
          className={`flex-1 py-3 font-semibold transition-colors ${
            vista === 'proximos'
              ? 'bg-liga-azul text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📅 Próximos ({proximos.length})
        </button>
        <button
          onClick={() => setVista('resultados')}
          className={`flex-1 py-3 font-semibold transition-colors ${
            vista === 'resultados'
              ? 'bg-liga-azul text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          🏆 Resultados ({resultados.length})
        </button>
      </div>

      {/* Estado de carga / error */}
      {cargando && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500">Cargando partidos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-liga-rojo rounded-lg shadow p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Sin partidos */}
      {!cargando && !error && partidosMostrados.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">
            {vista === 'proximos' ? '📅' : '🏆'}
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            {vista === 'proximos'
              ? 'No hay partidos programados'
              : 'No hay resultados registrados'}
          </h2>
          <p className="text-gray-500">
            {vista === 'proximos'
              ? 'Vuelve pronto para ver los próximos partidos.'
              : 'Los resultados aparecerán cuando se jueguen los partidos.'}
          </p>
        </div>
      )}

      {/* Lista de partidos */}
      {!cargando && !error && partidosMostrados.length > 0 && (
        <div className="space-y-4">
          {partidosMostrados.map((p) => {
            const local = p.equipo_local?.nombre || 'Local'
            const visitante = p.equipo_visitante?.nombre || 'Visitante'
            const fechaInfo = p.fecha

            return (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Cabecera de la fecha */}
                {fechaInfo && (
                  <div className="bg-liga-azul text-white px-4 py-2 text-sm flex justify-between items-center">
                    <span>
                      <strong>Fecha {fechaInfo.numero}</strong>
                      {fechaInfo.etapa?.nombre && (
                        <span className="ml-2 text-liga-amarillo">
                          · {fechaInfo.etapa.nombre}
                        </span>
                      )}
                    </span>
                    {fechaInfo.fecha_inicio && (
                      <span className="text-xs">
                        {formatearFecha(fechaInfo.fecha_inicio)}
                      </span>
                    )}
                  </div>
                )}

                {/* Cuerpo del partido */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Local */}
                    <div className="flex-1 text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {local}
                      </div>
                    </div>

                    {/* Marcador o VS */}
                    <div className="text-center min-w-[100px]">
                      {p.jugado ? (
                        <div className="text-3xl font-bold text-liga-azul">
                          {p.goles_local} - {p.goles_visitante}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">
                          VS
                        </div>
                      )}
                      {p.hora && (
                        <div className="text-xs text-gray-500 mt-1">
                          {p.hora.slice(0, 5)}
                        </div>
                      )}
                    </div>

                    {/* Visitante */}
                    <div className="flex-1 text-left">
                      <div className="text-lg font-bold text-gray-800">
                        {visitante}
                      </div>
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    {p.cancha && <span>📍 {p.cancha}</span>}
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${
                        p.jugado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.jugado ? '✓ Jugado' : '⏰ Programado'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Calendario