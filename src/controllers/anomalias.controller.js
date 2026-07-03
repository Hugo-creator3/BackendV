const prisma = require('../prisma');
const serializeBigInt = require('../utils/bigintSerializer');

// GET /api/anomalias
// Lista las anomalías detectadas por el modelo de ML para la institución del admin logueado,
// más un resumen para las tarjetas de métricas del panel.
exports.getAnomalias = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const anomalias = await prisma.anomalias_detectadas.findMany({
      where: {
        id_institucion: BigInt(tenantId)
      },
      include: {
        usuario: true
      },
      orderBy: {
        fecha_deteccion: 'desc'
      },
      take: 100 // últimas 100, suficiente para el panel en vivo
    });

    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const total = anomalias.length;
    const hoy = anomalias.filter(a => new Date(a.fecha_deteccion) >= inicioHoy).length;
    const criticas = anomalias.filter(a => a.score >= 0.8).length;
    const scorePromedio = total > 0
      ? anomalias.reduce((acc, a) => acc + a.score, 0) / total
      : 0;

    const lista = anomalias.map(a => ({
      id_anomalia: a.id_anomalia,
      id_asistencia: a.id_asistencia,
      score: a.score,
      tipo_probable: a.tipo_probable,
      fecha_deteccion: a.fecha_deteccion,
      usuario: {
        id_usuario: a.usuario.id_usuario,
        nombre: a.usuario.nombre,
        apellidos: a.usuario.apellidos,
        email: a.usuario.email
      }
    }));

    res.json(serializeBigInt({
      resumen: {
        total,
        hoy,
        criticas,
        scorePromedio: Math.round(scorePromedio * 100) / 100
      },
      lista
    }));

  } catch (error) {
    console.error('Error en getAnomalias:', error);
    res.status(500).json({ message: error.message });
  }
};
