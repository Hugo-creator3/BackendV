const prisma = require('../prisma');
const serializeBigInt = require('../utils/bigintSerializer');

exports.saveConfiguracion = async (req, res) => {

  try {

    const tenantId = req.tenantId;

    const {
      hora_entrada,
      hora_salida,
      tolerancia_minutos,
      max_usuarios,
      checkin_habilitado

    } = req.body;

    const config = await prisma.configuracion_empresa.upsert({

      where: {
        id_institucion: BigInt(tenantId)
      },

      update: {
        hora_entrada,
        hora_salida,
        tolerancia_minutos,
        max_usuarios,
        checkin_habilitado
      },

      create: {
        hora_entrada,
        hora_salida,
        tolerancia_minutos,
        max_usuarios,
        id_institucion: BigInt(tenantId)
      }

    });

res.json(serializeBigInt(config));

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
exports.getConfiguracion = async (req, res) => {

  try {

    const tenantId = req.tenantId;

    const config = await prisma.configuracion_empresa.findUnique({

      where: {
        id_institucion: BigInt(tenantId)
      }

    });

res.json(serializeBigInt(config));
  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};