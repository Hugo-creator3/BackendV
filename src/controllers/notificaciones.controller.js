const prisma = require('../prisma');
const serializeBigInt = require('../utils/bigintSerializer');

exports.getNotificaciones = async (req, res) => {
  try {

    const tenantId = req.tenantId;

    const notificaciones = await prisma.notificaciones.findMany({
      where: {
        id_institucion: BigInt(tenantId)
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });

    res.json(serializeBigInt(notificaciones));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};