const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const serializeBigInt = require('../utils/bigintSerializer');

exports.register = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      password,
      telefono,
      genero,
      fecha_nacimiento,
      clave_institucion
    } = req.body;

    // 1. Buscar institución por clave
    const institucion = await prisma.instituciones.findUnique({
      where: { clave_segura: clave_institucion }
      
    });

    if (!institucion) {
      return res.status(404).json({ message: "Clave de institución inválida" });
      
    }
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const usuario = await prisma.usuarios.create({
      data: {
        nombre,
        apellidos,
        email,
        password_hash: hashedPassword,
        telefono,
        genero,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        id_institucion: institucion.id_institucion
      }
    });


    res.json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en registro" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, usuario.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

 const token = jwt.sign(
  {
    id: Number(usuario.id_usuario),
    institucion: Number(usuario.id_institucion)
  },
  process.env.JWT_SECRET,
  { expiresIn: "8h" }
);
    res.json(serializeBigInt({
  token,
  usuario
}));

 } catch (error) {
  console.error("ERROR LOGIN:", error);
  res.status(500).json({ message: error.message });
}
};

exports.getUsuarios = async (req, res) => {
  try {

    const tenantId = req.tenantId;

    const usuarios = await prisma.usuarios.findMany({
      where: {
        id_institucion: BigInt(tenantId) // FILTRO DIRECTO
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });
console.log("TENANT ID:", req.tenantId);
res.json(serializeBigInt(usuarios));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const tenantId = req.user.institucion;

    await prisma.usuarios.deleteMany({
    where: {
    id_usuario: BigInt(id),
    id_institucion: BigInt(tenantId)
 }
 });

    res.json({ message: "Usuario eliminado" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }

  
};
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, telefono } = req.body;

   const tenantId = req.user.institucion;

const usuario = await prisma.usuarios.updateMany({
  where: {
    id_usuario: BigInt(id),
    id_institucion: BigInt(tenantId)
  },
  data: {
    nombre,
    apellidos,
    email,
    telefono
  }
});
    res.json(serializeBigInt(usuario));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token

    const usuario = await prisma.usuarios.findUnique({
      where: {
        id_usuario: BigInt(userId)
      },
      include: {
        institucion: true
      }
    });

    res.json(serializeBigInt(usuario));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};
exports.createUsuarioByAdmin = async (req, res) => {
  try {

    const tenantId = req.user.institucion;

    const {
      nombre,
      apellidos,
      email,
      password,
      telefono,
      genero
    } = req.body;

    // validar campos obligatorios
    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos obligatorios"
      });
    }

    // verificar email existente
    const existingUser = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear usuario
    const usuario = await prisma.usuarios.create({
      data: {
        nombre,
        apellidos,
        email,
        password_hash: hashedPassword,
        telefono,
        genero,
        id_institucion: BigInt(tenantId)
      }
    });

    res.status(201).json(serializeBigInt({
      message: "Usuario creado correctamente",
      usuario
    }));

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creando usuario"
    });
  }
};
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    await prisma.usuarios.update({
      where: { id_usuario: BigInt(userId) },
      data: { foto_url: fileUrl }
    });

    res.json({ photoUrl: fileUrl });

  } catch (error) {
    res.status(500).json({ message: "Error subiendo imagen" });
  }
};
