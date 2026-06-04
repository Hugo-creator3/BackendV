const jwt = require('jsonwebtoken')
const tenantContext = require('../context/tenantContext')

module.exports = function(req,res,next){

  try{

    const authHeader = req.headers.authorization

    if(!authHeader){
      return res.status(401).json({message:"Token requerido"})
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    tenantContext.run(decoded.institucion, () => {

      req.userId = decoded.id 
      req.tenantId = decoded.institucion 
      req.user = decoded; 


      next()

    })

  }catch(error){

    res.status(401).json({message:"Token inválido"})

  }

}