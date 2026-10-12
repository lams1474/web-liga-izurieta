# Web Pública - Liga Izurieta

Sitio web público de la **Liga Deportiva Barrial José Ignacio Izurieta**.

Sin login, cualquier persona puede consultar tablas de posiciones, goleadores,
sancionados, calendario y verificar carnets de jugadores.

---

## 🌐 URLs

| Entorno | URL |
|---|---|
| **Producción** | https://web-liga-izurieta.vercel.app |
| **Local** | http://localhost:5173 (o 5174) |
| **Repositorio** | https://github.com/lams1474/web-liga-izurieta |

---

## 📄 Páginas disponibles

### 🏠 Inicio
Página de bienvenida con información general de la liga.

### 📊 Tabla de Posiciones
- Selector de disciplina (fútbol, futsala, ecuavoly)
- Selector de categoría (hombres, mujeres, sub12, master40)
- Columnas: #, Equipo, PJ, PG, PE, PP, GF, GC, DG, PTS
- Líder destacado con etiqueta "LÍDER"

### ⚽ Goleadores
- Podio con las 3 primeras posiciones 🥇🥈🥉
- Tabla completa con todos los goleadores
- Ordenado por cantidad de goles

### 🟥 Sancionados
- Lista de jugadores con sanciones activas
- Diferentes colores según tipo de sanción
- Muestra fechas pendientes de cumplir

### 📅 Calendario
- Pestañas "Próximos" y "Resultados"
- Tarjetas por partido con hora, cancha, equipos
- Marcador visible cuando el partido ya se jugó

### 🎫 Verificar Carnet
- Buscador por cédula
- Estado: **HABILITADO** o **BLOQUEADO**
- Si está bloqueado, lista **TODOS los motivos**

---

## 🛠 Tecnologías

| Herramienta | Uso |
|---|---|
| React 19 | Framework principal |
| Vite 8 | Build tool |
| React Router 7 | Navegación |
| Tailwind CSS 3 | Estilos |
| Supabase 2 | Backend (solo lectura) |
| Lucide React | Iconos |
| Vercel | Hosting y deploy |

---

## 📁 Estructura del proyecto

```
web-liga-izurieta/
├── public/
├── src/
│   ├── assets/
│   │   └── escudo-liga.png      # Logo de la liga
│   ├── components/
│   │   ├── Header.jsx            # Barra de navegación
│   │   └── Footer.jsx            # Pie de página
│   ├── lib/
│   │   └── supabase.js           # Cliente de Supabase
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── TablaPosiciones.jsx
│   │   ├── Goleadores.jsx
│   │   ├── Sancionados.jsx
│   │   ├── Calendario.jsx
│   │   └── VerificarCarnet.jsx
│   ├── App.jsx                   # Rutas principales
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── .env.local                    # Variables de entorno (NO subir)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Instalación local

### Requisitos previos

- Node.js 20+
- npm 10+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/lams1474/web-liga-izurieta.git
cd web-liga-izurieta

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env.local
# (ver sección Configuración)

# 4. Arrancar el servidor
npm run dev
```

La web estará disponible en `http://localhost:5173`.

---

## 🔧 Configuración

### Variables de entorno

Crear `.env.local` en la raíz con:

```env
VITE_SUPABASE_URL=https://gylnajxmlalnyueanhll.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ NO subir este archivo a GitHub.** Ya está protegido por `.gitignore`.

### Obtener las credenciales

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Abrir el proyecto **App-liga-Izurieta**
3. Ir a **Settings → API**
4. Copiar `Project URL` y `anon public key`

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar build |
| `npm run lint` | Ejecutar ESLint |

---

## 🚀 Deploy en Vercel

### Deploy automático

Cada `git push` a la rama `main` dispara un redespliegue automático en Vercel.

### Configuración inicial

1. Conectar el repositorio en Vercel
2. Configurar las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

---

## 🎨 Paleta de colores

Definidos en `tailwind.config.js`:

| Nombre | Hex | Uso |
|---|---|---|
| `liga-azul` | #1e3a8a | Fondo principal |
| `liga-rojo` | #dc2626 | Acentos y alertas |
| `liga-amarillo` | #fbbf24 | Detalles y destacados |
| `liga-verde` | #16a34a | Estados positivos |

---

## 📚 Documentación completa

Para documentación completa del ecosistema, ver:
[liga-izurieta-docs](https://github.com/lams1474/liga-izurieta-docs)

---

## 🔒 Seguridad

- **Row Level Security** habilitado en todas las tablas
- Solo lectura para usuarios anónimos
- Datos sensibles protegidos por RLS
- Cumplimiento con LOPDP (Ley de Protección de Datos de Ecuador)

---

## 👨‍💻 Autor

**Luis Maigua**
- GitHub: [@lams1474](https://github.com/lams1474)
- Email: ligajoseizurieta@gmail.com

---

## 📅 Última actualización

Octubre 2026