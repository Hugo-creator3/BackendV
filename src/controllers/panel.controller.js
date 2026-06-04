const prisma = require('../prisma')
const serializeBigInt = require('../utils/bigintSerializer');

const ESTADOS_ASISTENCIA = ["ACEPTADO", "RETRASO"];

function parseHora(hora, fallback = "08:00") {
  const [horas, minutos] = (hora || fallback).split(":").map(Number);

  return {
    horas: Number.isFinite(horas) ? horas : 8,
    minutos: Number.isFinite(minutos) ? minutos : 0
  };
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isBusinessDay(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getExpectedBusinessDays(fechaCreacion, now, configuracion) {
  const expectedDays = [];
  const current = startOfDay(fechaCreacion);
  const today = startOfDay(now);
  const { horas, minutos } = parseHora(configuracion?.hora_entrada);
  const tolerancia = configuracion?.tolerancia_minutos || 0;

  while (current <= today) {
    if (isBusinessDay(current)) {
      const cutoff = new Date(current);
      cutoff.setHours(horas, minutos + tolerancia, 0, 0);

      const isCreationDay = getDateKey(current) === getDateKey(fechaCreacion);
      const createdAfterCutoff = isCreationDay && fechaCreacion > cutoff;
      const dayAlreadyDue = current < today || now >= cutoff;

      if (dayAlreadyDue && !createdAfterCutoff) {
        expectedDays.push(getDateKey(current));
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return expectedDays;
}

function buildEmptyCategories() {
  return {
    perfectos: {
      titulo: "100% asistencia y puntualidad",
      descripcion: "Usuarios con todas sus asistencias puntuales.",
      total: 0,
      usuarios: []
    },
    casiPerfectosRetrasos: {
      titulo: "Casi perfectos con 1-2 retrasos",
      descripcion: "Usuarios con asistencia completa y pocos retrasos.",
      total: 0,
      usuarios: []
    },
    completosConRetrasos: {
      titulo: "Asistencia completa con 3+ retrasos",
      descripcion: "Usuarios que asistieron todos los dias esperados, pero acumulan retrasos.",
      total: 0,
      usuarios: []
    },
    casiTodasConFaltas: {
      titulo: "Casi todas sus asistencias con 1-2 faltas",
      descripcion: "Usuarios con buen cumplimiento, pero faltas aisladas.",
      total: 0,
      usuarios: []
    },
    faltasFrecuentes: {
      titulo: "Usuarios con 3+ faltas",
      descripcion: "Usuarios con varias faltas reales en dias esperados.",
      total: 0,
      usuarios: []
    },
    irregulares: {
      titulo: "Irregulares",
      descripcion: "Usuarios con mas de 2 retrasos y al menos 2 faltas.",
      total: 0,
      usuarios: []
    },
    sinRegistros: {
      titulo: "Sin asistencia registrada",
      descripcion: "Usuarios sin ningun check-in valido en dias esperados.",
      total: 0,
      usuarios: []
    },
    sinDiasEvaluables: {
      titulo: "Sin dias evaluables",
      descripcion: "Usuarios nuevos o sin dias laborales vencidos todavia.",
      total: 0,
      usuarios: []
    }
  };
}

function getCategoriaUsuario(metricas) {
  if (metricas.diasEsperados === 0) {
    return "sinDiasEvaluables";
  }

  if (metricas.asistenciasRegistradas === 0) {
    return "sinRegistros";
  }

  if (metricas.retrasos > 2 && metricas.faltas >= 2) {
    return "irregulares";
  }

  if (metricas.faltas === 0 && metricas.retrasos === 0) {
    return "perfectos";
  }

  if (metricas.faltas === 0 && metricas.retrasos <= 2) {
    return "casiPerfectosRetrasos";
  }

  if (metricas.faltas === 0 && metricas.retrasos >= 3) {
    return "completosConRetrasos";
  }

  if (metricas.faltas <= 2) {
    return "casiTodasConFaltas";
  }

  return "faltasFrecuentes";
}

exports.panel = async (req, res) => {

  try {

    const institucion = await prisma.instituciones.findUnique({

      where: {
        id_institucion: req.tenantId
      }

    })

    const admin = await prisma.admins.findUnique({

      where: {
        id_admin: req.userId
      }

    })

    res.json({

      mensaje: `Hola ${admin.nombre}`,
      institucion: institucion.nombre

    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }


};

exports.getDashboard = async (req, res) => {
  try {

    const tenantId = req.tenantId;

    // 👥 Total usuarios
    const totalUsuarios = await prisma.usuarios.count({
      where: {
        id_institucion: BigInt(tenantId)
      }
    });

    // 📅 Hoy
    const start = new Date();
    start.setHours(0,0,0,0);

    // ✅ Exitosos hoy
    const exitosos = await prisma.asistencias.count({
      where: {
        id_institucion: BigInt(tenantId),
        estado: "ACEPTADO",
        fecha_hora: { gte: start }
      }
    });

    // ❌ Fallidos hoy
    const fallidos = await prisma.asistencias.count({
      where: {
        id_institucion: BigInt(tenantId),
        estado: "DENEGADO",
        fecha_hora: { gte: start }
      }
    });

    const total = exitosos + fallidos;

    const porcentaje = total > 0
      ? Math.round((exitosos / total) * 100)
      : 0;
  const porcentajeFallidos = total > 0
  ? Math.round((fallidos / total) * 100)
  : 0;

    res.json({
      usuarios: totalUsuarios,
      accesosHoy: total,
      exitosos,
      fallidos,
      porcentaje,
      porcentajeFallidos
    });
  

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEstadisticasUsuarios = async (req, res) => {
  try {
    const tenantId = BigInt(req.tenantId);
    const now = new Date();

    const [usuarios, asistencias, configuracion] = await Promise.all([
      prisma.usuarios.findMany({
        where: {
          id_institucion: tenantId,
          activo: true
        },
        orderBy: {
          nombre: 'asc'
        }
      }),
      prisma.asistencias.findMany({
        where: {
          id_institucion: tenantId
        },
        orderBy: {
          fecha_hora: 'asc'
        }
      }),
      prisma.configuracion_empresa.findUnique({
        where: {
          id_institucion: tenantId
        }
      })
    ]);

    const asistenciasPorUsuario = new Map();

    for (const asistencia of asistencias) {
      const userId = asistencia.id_usuario.toString();

      if (!asistenciasPorUsuario.has(userId)) {
        asistenciasPorUsuario.set(userId, []);
      }

      asistenciasPorUsuario.get(userId).push(asistencia);
    }

    const categorias = buildEmptyCategories();

    const resumen = {
      totalUsuarios: usuarios.length,
      usuariosEvaluados: 0,
      diasEsperados: 0,
      asistenciasRegistradas: 0,
      asistenciasPuntuales: 0,
      retrasos: 0,
      faltas: 0,
      intentosFallidos: 0,
      porcentajeAsistencia: 0,
      porcentajePuntualidad: 0
    };

    const ranking = usuarios.map((usuario) => {
      const userId = usuario.id_usuario.toString();
      const registros = asistenciasPorUsuario.get(userId) || [];
      const diasEsperados = getExpectedBusinessDays(
        new Date(usuario.fecha_creacion),
        now,
        configuracion
      );
      const diasEsperadosSet = new Set(diasEsperados);
      const asistenciaPorDia = new Map();

      for (const registro of registros) {
        const dayKey = getDateKey(new Date(registro.fecha_hora));

        if (!diasEsperadosSet.has(dayKey)) {
          continue;
        }

        if (!asistenciaPorDia.has(dayKey)) {
          asistenciaPorDia.set(dayKey, {
            puntual: false,
            retraso: false,
            denegados: 0,
            registros: []
          });
        }

        const dia = asistenciaPorDia.get(dayKey);
        dia.registros.push(registro);

        if (registro.estado === "ACEPTADO") {
          dia.puntual = true;
        }

        if (registro.estado === "RETRASO") {
          dia.retraso = true;
        }

        if (registro.estado === "DENEGADO") {
          dia.denegados += 1;
        }
      }

      let asistenciasPuntuales = 0;
      let retrasos = 0;
      let intentosFallidos = 0;
      const diasConAsistencia = [];
      const diasConFalta = [];
      const diasConRetraso = [];

      for (const dayKey of diasEsperados) {
        const dia = asistenciaPorDia.get(dayKey);

        if (!dia) {
          diasConFalta.push(dayKey);
          continue;
        }

        intentosFallidos += dia.denegados;

        if (dia.puntual) {
          asistenciasPuntuales += 1;
          diasConAsistencia.push(dayKey);
          continue;
        }

        if (dia.retraso) {
          retrasos += 1;
          diasConAsistencia.push(dayKey);
          diasConRetraso.push(dayKey);
          continue;
        }

        diasConFalta.push(dayKey);
      }

      const diasEsperadosTotal = diasEsperados.length;
      const asistenciasRegistradas = diasConAsistencia.length;
      const faltas = diasConFalta.length;
      const porcentajeAsistencia = diasEsperadosTotal > 0
        ? Math.round((asistenciasRegistradas / diasEsperadosTotal) * 100)
        : 0;
      const porcentajePuntualidad = asistenciasRegistradas > 0
        ? Math.round((asistenciasPuntuales / asistenciasRegistradas) * 100)
        : 0;

      const metricas = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombreCompleto: `${usuario.nombre} ${usuario.apellidos}`,
        email: usuario.email,
        telefono: usuario.telefono,
        foto_url: usuario.foto_url,
        fecha_creacion: usuario.fecha_creacion,
        diasEsperados: diasEsperadosTotal,
        asistenciasRegistradas,
        asistenciasPuntuales,
        retrasos,
        faltas,
        intentosFallidos,
        porcentajeAsistencia,
        porcentajePuntualidad,
        diasConAsistencia,
        diasConRetraso,
        diasConFalta
      };

      const categoria = getCategoriaUsuario(metricas);
      metricas.categoria = categoria;
      metricas.categoriaTitulo = categorias[categoria].titulo;
      categorias[categoria].usuarios.push(metricas);

      resumen.usuariosEvaluados += diasEsperadosTotal > 0 ? 1 : 0;
      resumen.diasEsperados += diasEsperadosTotal;
      resumen.asistenciasRegistradas += asistenciasRegistradas;
      resumen.asistenciasPuntuales += asistenciasPuntuales;
      resumen.retrasos += retrasos;
      resumen.faltas += faltas;
      resumen.intentosFallidos += intentosFallidos;

      return metricas;
    });

    for (const categoria of Object.values(categorias)) {
      categoria.usuarios.sort((a, b) => {
        if (b.porcentajeAsistencia !== a.porcentajeAsistencia) {
          return b.porcentajeAsistencia - a.porcentajeAsistencia;
        }

        if (b.porcentajePuntualidad !== a.porcentajePuntualidad) {
          return b.porcentajePuntualidad - a.porcentajePuntualidad;
        }

        return a.nombreCompleto.localeCompare(b.nombreCompleto);
      });
      categoria.total = categoria.usuarios.length;
    }

    ranking.sort((a, b) => {
      if (b.porcentajeAsistencia !== a.porcentajeAsistencia) {
        return b.porcentajeAsistencia - a.porcentajeAsistencia;
      }

      if (b.porcentajePuntualidad !== a.porcentajePuntualidad) {
        return b.porcentajePuntualidad - a.porcentajePuntualidad;
      }

      if (a.faltas !== b.faltas) {
        return a.faltas - b.faltas;
      }

      if (a.retrasos !== b.retrasos) {
        return a.retrasos - b.retrasos;
      }

      return a.nombreCompleto.localeCompare(b.nombreCompleto);
    });

    resumen.porcentajeAsistencia = resumen.diasEsperados > 0
      ? Math.round((resumen.asistenciasRegistradas / resumen.diasEsperados) * 100)
      : 0;
    resumen.porcentajePuntualidad = resumen.asistenciasRegistradas > 0
      ? Math.round((resumen.asistenciasPuntuales / resumen.asistenciasRegistradas) * 100)
      : 0;

    res.json(serializeBigInt({
      generadoEn: now,
      configuracion: configuracion || null,
      resumen,
      categorias,
      ranking
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAdmins = async (req, res) => {

  try {

    const admins = await prisma.admins.findMany({

      where: {
        id_institucion: BigInt(req.tenantId)
      },

      select: {
        id_admin: true,
        nombre: true,
        email: true
      }

    });

    res.json(serializeBigInt(admins));

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
