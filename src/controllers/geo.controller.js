const prisma = require('../prisma')
const axios = require("axios");
const serializeBigInt = require('../utils/bigintSerializer')

const ANOMALY_API_URL = process.env.ANOMALY_API_URL;
const ANOMALY_API_KEY = process.env.ANOMALY_API_KEY;

function notificarAnomalia(idAsistencia) {
console.log("URL de la API siendo usada:", process.env.ANOMALY_API_URL);
console.log("Longitud de la URL:", process.env.ANOMALY_API_URL?.length);
  axios.post(
    
    `${ANOMALY_API_URL}/predict/${idAsistencia}`,
    {},
    {
      headers: {
        "X-API-Key": ANOMALY_API_KEY
      },
      timeout: 90000
    }
  ).catch(err => {

    console.error(
      "Error llamando API de anomalías:",
      err.message
    );

  });

}
// OBTENER CONFIG
exports.getConfig = async (req, res) => {
  try {

   const config = await prisma.geolocalizacion_config.findFirst({
  where: {
    id_institucion: BigInt(req.tenantId)
  }
});

    res.json(serializeBigInt(config))

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// CREAR O ACTUALIZAR
exports.saveConfig = async (req, res) => {
  try {

   const {
   latitud,
   longitud,
   radio,
   bloqueo_intentos,
   bloqueo_horario
   } = req.body

      const existing = await prisma.geolocalizacion_config.findFirst({
  where: {
    id_institucion: BigInt(req.tenantId)
  }
});
    let result

    if (existing) {
      result = await prisma.geolocalizacion_config.update({
        where: { id_config: existing.id_config },
        data: {
          latitud,
          longitud,
          radio_metros: radio,
          bloqueo_intentos,
          bloqueo_horario
         }
      })
    } else {
      console.log("TENANT:", req.tenantId)
console.log("BODY:", req.body)
      result = await prisma.geolocalizacion_config.create({
        data: {
           latitud,
           longitud,
           radio_metros: radio,
           bloqueo_intentos,
           bloqueo_horario
        }
})
    }
console.log("BODY:", req.body)
    res.json(serializeBigInt(result))

  } catch (error) {
  console.error("ERROR COMPLETO:", error)
  res.status(500).json({ message: error.message })
}
};

exports.validateLocation = async (req, res) => {
  try {
    const { latitud, longitud } = req.body;

    // CONFIG GEOLOCALIZACIÓN
    const config = await prisma.geolocalizacion_config.findFirst({
      where: {
        id_institucion: BigInt(req.tenantId)
      }
    });

    if (!config) {
      return res.status(404).json({
        message: "Geolocalización no configurada"
      });
    }

    // CONFIG EMPRESA
    const configuracion =
      await prisma.configuracion_empresa.findUnique({
        where: {
          id_institucion: BigInt(req.tenantId)
        }
      });
      if (
  configuracion &&
  configuracion.checkin_habilitado === false
) {
  return res.status(403).json({
    success: false,
    message:
      "El administrador ha deshabilitado temporalmente los check-ins."
  });
}

    // ==========================
    // VALIDAR CHECK-IN PREVIO
    // ==========================
    
// ==========================
// VALIDAR CHECK-IN DEL DÍA
// ==========================

const inicioDia = new Date();
inicioDia.setHours(0, 0, 0, 0);

const finDia = new Date();
finDia.setHours(23, 59, 59, 999);

const checkinHoy =
  await prisma.asistencias.findFirst({
    where: {
      id_usuario: BigInt(req.user.id),
      id_institucion: BigInt(req.tenantId),

      estado: {
        in: ["ACEPTADO", "RETRASO"]
      },

      fecha_hora: {
        gte: inicioDia,
        lte: finDia
      }
    }
  });

if (checkinHoy) {
  return res.status(403).json({
    success: false,
    message: "Ya realizaste tu check-in de hoy."
  });
}



    // ==========================
    // BLOQUEO POR INTENTOS
    // ==========================
    const ultimosIntentos =
      await prisma.asistencias.findMany({
        where: {
          id_usuario: BigInt(req.user.id),
          id_institucion: BigInt(req.tenantId)
        },
        orderBy: {
          fecha_hora: "desc"
        },
        take: 3
      });

    if (config.bloqueo_intentos) {
      const bloqueado =
        ultimosIntentos.length === 3 &&
        ultimosIntentos.every(
          a => a.estado === "DENEGADO"
        );

      if (bloqueado) {
        const ultimoIntento =
          ultimosIntentos[0];

        const minutos =
          (new Date() -
            new Date(ultimoIntento.fecha_hora)) /
          60000;

        if (minutos < 5) {
          return res.status(403).json({
            success: false,
            message:
              "Bloqueado temporalmente por 5 minutos debido a intentos fallidos."
          });
        }
      }
    }

    // ==========================
    // BLOQUEO POR HORARIO
    // ==========================
 

    // ==========================
    // CALCULAR DISTANCIA
    // ==========================
    const {
      latitud: latDB,
      longitud: lngDB,
      radio_metros
    } = config;

    const toRad = value =>
      (value * Math.PI) / 180;

    const R = 6371000;

    const dLat =
      toRad(latitud - latDB);

    const dLng =
      toRad(longitud - lngDB);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(latDB)) *
        Math.cos(toRad(latitud)) *
        Math.sin(dLng / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    const distancia = R * c;

    console.log("Distancia:", distancia);

    const dentro =
      distancia <= radio_metros;

    // ==========================
    // VALIDAR HORARIO
    // ==========================
    if (
      !configuracion ||
      !configuracion.hora_entrada
    ) {
      return res.status(400).json({
        message:
          "No hay horario configurado"
      });
    }

    const ahora = new Date();

    const [
      horaEntrada,
      minutoEntrada
    ] =
      configuracion.hora_entrada
        .split(":")
        .map(Number);

    const entrada = new Date();

    entrada.setHours(horaEntrada);
    entrada.setMinutes(minutoEntrada);
    entrada.setSeconds(0);

    const limite =
      new Date(
        entrada.getTime() +
        configuracion.tolerancia_minutos *
          60000
      );

    const minutosTarde =
      Math.floor(
        (ahora - entrada) /
        60000
      );

    let estado = "ACEPTADO";

    if (!dentro) {
      estado = "DENEGADO";
    } else if (ahora > limite) {
      estado = "RETRASO";
    }

    // ==========================
    // GUARDAR ASISTENCIA
    // ==========================
    const asistencia = await prisma.asistencias.create({

  data: {

    latitud,
    longitud,
    estado,

    minutos_retraso:
      estado === "RETRASO"
        ? minutosTarde
        : 0,

    id_usuario: BigInt(req.user.id),

    id_institucion: BigInt(req.tenantId)

  }

});

    // ==========================
    // NOTIFICACIÓN POR 3 FALLOS
    // ==========================
    if (!dentro) {
      const lastAttempts =
        await prisma.asistencias.findMany({
          where: {
            id_usuario: BigInt(
              req.user.id
            ),
            id_institucion: BigInt(
              req.tenantId
            )
          },
          orderBy: {
            fecha_hora: "desc"
          },
          take: 3
        });

      const allFailed =
        lastAttempts.length === 3 &&
        lastAttempts.every(
          a => a.estado === "DENEGADO"
        );

      if (allFailed) {
        console.log(
          "🚨 3 intentos fallidos detectados"
        );

        const ultimaNotificacion =
          await prisma.notificaciones.findFirst({
            where: {
              id_usuario: BigInt(
                req.user.id
              ),
              tipo: "CRITICO"
            },
            orderBy: {
              fecha_creacion: "desc"
            }
          });

        const puedeCrear =
          !ultimaNotificacion ||
          (new Date() -
            new Date(
              ultimaNotificacion.fecha_creacion
            )) >
            600000;

        if (puedeCrear) {
          await prisma.notificaciones.create({
            data: {
              tipo: "CRITICO",
              mensaje:
                `El usuario ${req.user.id} ha realizado 3 intentos fallidos consecutivos.`,
              id_usuario: BigInt(
                req.user.id
              ),
              id_institucion: BigInt(
                req.tenantId
              )
            }
          });
        }
      }
    }

    // ==========================
    // RESPUESTA
    // ==========================
   if (dentro) {

    res.json({
        success: true,
        message:
            estado === "RETRASO"
                ? `Llegó ${minutosTarde} minutos tarde`
                : "Dentro del área",
        distancia
    });

    notificarAnomalia(Number(asistencia.id_asistencia));

    return;
}

res.status(403).json({
    success: false,
    message: "Fuera del área permitida",
    distancia
});

notificarAnomalia(Number(asistencia.id_asistencia));

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

