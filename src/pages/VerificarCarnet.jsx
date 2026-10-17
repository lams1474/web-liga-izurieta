import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useSearchParams } from 'react-router-dom'

function VerificarCarnet() {
  const [cedula, setCedula] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  // Leer cédula de la URL
  const [searchParams] = useSearchParams()
  const cedulaParam = searchParams.get('cedula')

  // Función principal de búsqueda (acepta cédula opcional para el QR)
  const buscarJugador = async (e, cedulaParaBuscar) => {
    if (e) e.preventDefault()
    
    // Usar la cédula del parámetro o la del estado
    const cedulaFinal = cedulaParaBuscar || cedula
    if (!cedulaFinal.trim()) return

    setBuscando(true)
    setError(null)
    setResultado(null)

    // 1. Buscar al jugador por cédula
    const { data: jugador, error: errJugador } = await supabase
      .from('jugadores')
      .select('id, nombres, apellidos, cedula, foto_url, es_menor, carnet_pagado, carnet_ano')
      .eq('cedula', cedulaFinal.trim())
      .maybeSingle()

    if (errJugador) {
      setError('Error al buscar: ' + errJugador.message)
      setBuscando(false)
      return
    }

    if (!jugador) {
      setError('No se encontró ningún jugador con esa cédula.')
      setBuscando(false)
      return
    }

    // 2. Buscar equipos activos
    const { data: inscripciones, error: errInsc } = await supabase
      .from('jugador_equipo')
      .select(`
        dorsal,
        posicion,
        equipo:equipos!jugador_equipo_equipo_id_fkey (
          id,
          nombre,
          disciplina,
          categoria
        )
      `)
      .eq('jugador_id', jugador.id)
      .eq('activo', true)

    if (errInsc) {
      setError('Error al buscar equipos: ' + errInsc.message)
      setBuscando(false)
      return
    }

    // 3. Validar para cada equipo
    const validaciones = await Promise.all(
      (inscripciones || []).map(async (insc) => {
        const { data: validacion, error: errVal } = await supabase
          .rpc('validar_carnet', {
            p_jugador_id: jugador.id,
            p_equipo_id: insc.equipo.id,
          })

        return {
          equipo: insc.equipo,
          dorsal: insc.dorsal,
          posicion: insc.posicion,
          validacion: errVal
            ? { estado: 'ERROR', motivos: [errVal.message] }
            : validacion?.[0] || { estado: 'ERROR', motivos: ['Sin respuesta'] },
        }
      })
    )

    setResultado({ jugador, validaciones })
    setBuscando(false)
  }

  // EFECTO: Auto-buscar si viene la cédula en la URL
  useEffect(() => {
    if (cedulaParam) {
      setCedula(cedulaParam)
      // Pasamos la cédula directamente para evitar fallos de sincronización
      buscarJugador(null, cedulaParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cedulaParam])

  const limpiar = () => {
    setCedula('')
    setResultado(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-liga-azul mb-2">
        Verificar Carnet
      </h1>
      <p className="text-gray-600 mb-6">
        Ingresa la cédula del jugador para verificar si está habilitado para jugar.
      </p>

      {/* Formulario */}
      <form
        onSubmit={buscarJugador}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cédula del jugador:
        </label>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ej: 0504554924"
            className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liga-azul text-lg"
            autoFocus
          />
          <button
            type="submit"
            disabled={buscando || !cedula.trim()}
            className="px-6 py-3 bg-liga-azul text-white rounded-md font-semibold hover:bg-liga-azul/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {buscando ? 'Buscando...' : '🔍 Buscar'}
          </button>
          {resultado && (
            <button
              type="button"
              onClick={limpiar}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow p-4 mb-6">
          <p className="text-red-700 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-liga-azul mb-4">
              {resultado.jugador.apellidos} {resultado.jugador.nombres}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Cédula</p>
                <p className="font-semibold">{resultado.jugador.cedula}</p>
              </div>
              <div>
                <p className="text-gray-500">Menor de edad</p>
                <p className="font-semibold">
                  {resultado.jugador.es_menor ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Carnet pagado</p>
                <p className="font-semibold">
                  {resultado.jugador.carnet_pagado
                    ? `Sí (${resultado.jugador.carnet_ano})`
                    : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Equipos</p>
                <p className="font-semibold">
                  {resultado.validaciones.length}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-liga-azul mb-3">
            Estado por equipo:
          </h3>

          {resultado.validaciones.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow p-4">
              <p className="text-yellow-800">
                ⚠️ Este jugador no está inscrito en ningún equipo activo.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {resultado.validaciones.map((v) => {
              const habilitado = v.validacion.estado === 'HABILITADO'

              return (
                <div
                  key={v.equipo.id}
                  className={`rounded-lg shadow-lg border-l-4 overflow-hidden ${
                    habilitado
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {habilitado ? '✅' : '🚫'}
                      </span>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">
                          {v.equipo.nombre}
                        </div>
                        <div className="text-sm text-gray-600">
                          {v.equipo.disciplina} · {v.equipo.categoria}
                          {v.dorsal && ` · Dorsal ${v.dorsal}`}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                        habilitado ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {habilitado ? 'HABILITADO' : 'BLOQUEADO'}
                    </span>
                  </div>

                  {!habilitado && v.validacion.motivos && v.validacion.motivos.length > 0 && (
                    <div className="px-4 pb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Debe regularizar:
                      </p>
                      <ul className="space-y-1">
                        {v.validacion.motivos.map((m, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 bg-white/60 rounded p-2 flex items-start gap-2"
                          >
                            <span className="text-red-500 font-bold">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {habilitado && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-green-700 bg-white/60 rounded p-3">
                        ✓ Puede jugar. No tiene sanciones, deudas ni carnet pendiente.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {!resultado && !error && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Prueba con estas cédulas:
          </p>
          <ul className="text-sm text-blue-700 mt-2 ml-6 list-disc">
            <li><strong>0504554924</strong> - CHACHA GALLARDO (sancionado)</li>
            <li><strong>0550030357</strong> - TOAQUIZA CHICAIZA (roja directa)</li>
            <li><strong>0502702905</strong> - NETO LEMA (doble amarilla)</li>
            <li><strong>0504432451</strong> - ELIZALDE SEGOVIA (limpio)</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default VerificarCarnet