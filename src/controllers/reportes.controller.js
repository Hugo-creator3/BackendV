const nodemailer = require('nodemailer');

exports.enviarReporte = async (req, res) => {
  try {

    const { tipoReporte, fechaInicio, fechaFin, mensaje } = req.body;

    // 🟢 Configuración del correo (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maxx333mtz@gmail.com',
        pass: 'kyuy qscx bbnq lqzq' // ⚠️ NO tu contraseña normal
      }
    });

    // 📩 Contenido del correo
    const mailOptions = {
      from: 'jorgeapostol46@gmail.com',
      to: 'maxx333mtz@gmail.com',
      subject: `Nuevo Reporte - ${tipoReporte}`,
      html: `
        <h2>Nuevo reporte recibido</h2>
        <p><b>Tipo:</b> ${tipoReporte}</p>
        <p><b>Fecha inicio:</b> ${fechaInicio}</p>
        <p><b>Fecha fin:</b> ${fechaFin}</p>
        <p><b>Mensaje:</b></p>
        <p>${mensaje}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Reporte enviado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enviando reporte' });
  }
};