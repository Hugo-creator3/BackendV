const { Resend } = require('resend')

const resend = new Resend(
  process.env.RESEND_API_KEY
)

const enviarCodigo = async (
  email,
  codigo
) => {

  await resend.emails.send({
    from: 'onboarding@resend.dev',

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

        <p>
          Este código expira en 10 minutos.
        </p>
      </div>
    `
  })

}

module.exports = {
  enviarCodigo
}