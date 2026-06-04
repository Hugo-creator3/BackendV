const crypto = require('crypto')

function generarClaveEmpresa() {

  const random = crypto.randomBytes(4).toString('hex')

  return `EMP-${random.toUpperCase()}`
}

module.exports = generarClaveEmpresa