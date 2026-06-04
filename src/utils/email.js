const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const enviarCodigo = async (email, codigo) => {

  await transporter.sendMail({
    from: `"VirtualID" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Código de verificación',
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Verificación de cuenta</h2>

        <p>Tu código es:</p>

        <h1 style="
          letter-spacing:5px;
          color:#2563eb;
        ">
          ${codigo}
        </h1>

        <p>Este código expira en 10 minutos.</p>
      </div>
    `
  })

}

module.exports = {
  enviarCodigo
}