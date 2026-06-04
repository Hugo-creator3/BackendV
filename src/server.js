require('dns').setDefaultResultOrder('ipv4first')
require('dotenv').config()


const express = require('express')
const cors = require('cors')

const tarjetaRoutes = require('./routes/tarjeta.routes')
const authRoutes = require('./routes/auth.routes')
const panelRoutes = require('./routes/panel.routes')
const usuariosRoutes = require('./routes/usuarios.routes');
const app = express()
const geoRoutes = require('./routes/geo.routes')
const asistenciasRoutes = require('./routes/asistencias.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const reportesRoutes = require('./routes/reportes.routes');



// Configuración
const PORT = process.env.APP_PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:5173',
    'https://TU-FRONTEND.onrender.com'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  })
})

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'BackendV1 API',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// Rutas
app.use('/api/reportes', reportesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/geo', geoRoutes)
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/panel', panelRoutes)
app.use('/api/configuracion', require('./routes/configuracion.routes'));
app.use('/api/tarjeta', tarjetaRoutes)

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    statusCode
  })
})

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor Express iniciado`)
  console.log(`Puerto: ${PORT}`)
  console.log(`Ambiente: ${NODE_ENV}`)
  console.log(`Accede a: http://localhost:${PORT}`)
})