const prisma = require('../prisma')
const serializeBigInt = require('../utils/bigintSerializer')
const tenantContext = require('../context/tenantContext');

exports.obtenerDiseno = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const diseno = await prisma.tarjeta_diseno.findUnique({
      where: {
        id_institucion: BigInt(tenantId)
      }
    });

    res.json(serializeBigInt(diseno));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.guardarDiseno = async (req, res) => {
  try {
    const data = req.body;
    const tenantId = req.tenantId; // Viene de tu auth.middleware

    const resultado = await prisma.tarjeta_diseno.upsert({
      where: {
        id_institucion: BigInt(tenantId)
      },
      update: {
        nombre_institucion: data.nombre_institucion,
        logo_url: data.logo_url,
        color_primario: data.color_primario,
        color_secundario: data.color_secundario,
        color_terciario: data.color_terciario,
        color_cuarto: data.color_cuarto,
        layout: data.layout

      },
      create: {
       nombre_institucion: data.nombre_institucion,
       logo_url: data.logo_url,
       color_primario: data.color_primario,
       color_secundario: data.color_secundario,
       color_terciario: data.color_terciario,
       color_cuarto: data.color_cuarto,
       layout: data.layout,
       id_institucion: BigInt(tenantId)
      }
    });

    res.json(serializeBigInt(resultado));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

