const prisma = require('../prisma');
const serializeBigInt = require('../utils/bigintSerializer');

exports.getAsistencias = async (req, res) => {
  try {

    const tenantId = req.tenantId;

    const asistencias = await prisma.asistencias.findMany({
      where: {
        id_institucion: BigInt(tenantId) //  CLAVE
      },
      include: {
        usuario: true
      },
      orderBy: {
        fecha_hora: 'desc'
      }
    });

    res.json(serializeBigInt(asistencias));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMyAsistencias = async (req, res) => {
  try {

    const userId = req.user.id; // 🔥 del token
    const tenantId = req.tenantId;

    const asistencias = await prisma.asistencias.findMany({
      where: {
        id_usuario: BigInt(userId),        // 🔥 SOLO ESTE USUARIO
        id_institucion: BigInt(tenantId)   // 🔥 seguridad multi-tenant
      },
      orderBy: {
        fecha_hora: 'desc'
      }
    });

    res.json(serializeBigInt(asistencias));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};