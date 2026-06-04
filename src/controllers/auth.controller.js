const prisma = require('../prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generarClave = require('../utils/generarClave')
const { enviarCodigo } = require('../utils/email')

// REGISTRAR EMPRESA
exports.crearEmpresa = async (req, res) => {

  try {

    const { nombre, razon_social, rfc, tipoDeInstitucion } = req.body

    const clave = generarClave()

    const empresa = await prisma.instituciones.create({
      data: {
        nombre,
        razon_social,
        rfc,
        tipo_institucion: tipoDeInstitucion,
        clave_segura: clave
      }
    })

    res.json({
      message: "Empresa creada",
      clave_segura: clave
    })

  } catch (error) {

    res.status(500).json({ error: error.message })
  }
}



exports.registrarAdmin = async (req, res) => {

  try {

    const {
  email,
  nombre,
  password,
  codigoEmpresa
} = req.body= req.body


    const institucion = await prisma.instituciones.findUnique({
      where: {
        clave_segura: codigoEmpresa
      }
    })

    if (!institucion) {

      return res.status(404).json({
        message: "Código de empresa inválido"
      })

    }

    const hash = await bcrypt.hash(password, 10)

    const admin = await prisma.admins.create({

      data: {

        email,
        nombre,
        cargo:null,
        password_hash: hash,
        id_institucion: institucion.id_institucion
      }

    })

    res.json({
      message: "Admin creado correctamente"
    })

  } catch (error) {

    res.status(500).json({ error: error.message })
  }
}


exports.login = async (req, res) => {

  try {

    const { email, password } = req.body

    const admin = await prisma.admins.findUnique({
      where: { email }
    })

    if (!admin) {
      return res.status(401).json({
        message: "Usuario no encontrado"
      })
    }

    const valid = await bcrypt.compare(password, admin.password_hash)

    if (!valid) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      })
    }

  const token = jwt.sign(
  {
    id: Number(admin.id_admin),
    institucion: Number(admin.id_institucion),
    tipo: 'admin' // 🔥 IMPORTANTE
  },
  process.env.JWT_SECRET,
  { expiresIn: "8h" }
);

    res.json({
      token
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}
exports.enviarCodigoRegistro = async (req, res) => {

  try {

    const {
      email
    } = req.body

    const existe = await prisma.admins.findUnique({
      where: { email }
    })

    if (existe) {
      return res.status(400).json({
        message: 'El correo ya está registrado'
      })
    }

    const codigo = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const expiracion = new Date(
      Date.now() + 10 * 60 * 1000
    )

    await prisma.codigos_verificacion.create({
      data: {
        email,
        codigo,
        expira_en: expiracion
      }
    })

    await enviarCodigo(email, codigo)

    res.json({
      message: 'Código enviado'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: error.message
    })

  }

}
exports.verificarCodigoYRegistrar = async (req, res) => {

  try {

    const {
      email,
      nombre,
      password,
      cargo,
      codigoEmpresa,
      codigo
    } = req.body

    const registro = await prisma.codigos_verificacion.findFirst({
      where: {
        email,
        codigo,
        usado: false
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    })

    if (!registro) {
      return res.status(400).json({
        message: 'Código inválido'
      })
    }

    if (new Date() > registro.expira_en) {
      return res.status(400).json({
        message: 'Código expirado'
      })
    }

    const institucion = await prisma.instituciones.findUnique({
      where: {
        clave_segura: codigoEmpresa
      }
    })

    if (!institucion) {
      return res.status(404).json({
        message: 'Código de empresa inválido'
      })
    }

    const hash = await bcrypt.hash(password, 10)

    await prisma.admins.create({
      data: {
        email,
        nombre,
        cargo,
        password_hash: hash,
        id_institucion: institucion.id_institucion
      }
    })

    await prisma.codigos_verificacion.update({
      where: {
        id: registro.id
      },
      data: {
        usado: true
      }
    })

    res.json({
      message: 'Cuenta creada correctamente'
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}
