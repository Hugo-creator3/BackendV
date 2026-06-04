const { PrismaClient } = require('@prisma/client')
const tenantContext = require('./context/tenantContext')

const prisma = new PrismaClient().$extends({

  query: {

    admins: {

      async findMany({ args, query }) {

        const tenantId = tenantContext.getTenantId()

        if (tenantId) {

          args.where = {
            ...args.where,
            id_institucion: tenantId
          }

        }

        return query(args)

      },

      async findFirst({ args, query }) {

        const tenantId = tenantContext.getTenantId()

        if (tenantId) {

          args.where = {
            ...args.where,
            id_institucion: tenantId
          }

        }

        return query(args)

      },

      async create({ args, query }) {

        const tenantId = tenantContext.getTenantId()

        if (tenantId) {
          args.data.id_institucion = tenantId
        }

        return query(args)

      }

    },
     tarjeta_diseno: {

    async findFirst({ args, query }) {

      const tenantId = tenantContext.getTenantId()

      if (tenantId) {

        args.where = {
          ...args.where,
          id_institucion: tenantId
        }

      }

      return query(args)
    },

    async create({ args, query }) {

      const tenantId = tenantContext.getTenantId()

      if (tenantId) {
        args.data.id_institucion = tenantId
      }

      return query(args)

    },

    async update({ args, query }) {

      const tenantId = tenantContext.getTenantId()

      if (tenantId) {

        args.where = {
          ...args.where,
          id_institucion: tenantId
        }

      }

      return query(args)
    }

  },
  
geolocalizacion_config: {

  async findFirst({ args, query }) {
    const tenantId = tenantContext.getTenantId()

    if (tenantId) {
      args.where = {
        ...args.where,
        id_institucion: tenantId
      }
    }

    return query(args)
  },
create: async ({ args, query }) => {
  const tenantId = tenantContext.getTenantId()

  console.log("TENANT CONTEXT:", tenantId)
  console.log("ARGS CREATE:", JSON.stringify(args, null, 2))

  if (tenantId) {
    args.data = {
      ...args.data,
      institucion: {
        connect: {
          id_institucion: BigInt(tenantId)
        }
      }
    }
  }

  return query(args)

},

  async update({ args, query }) {
    const tenantId = tenantContext.getTenantId()

    if (tenantId) {
      args.where = {
        ...args.where,
        id_institucion: tenantId
      }
    }

    return query(args)
  }

}
    

  },

  usuarios: {

  async findMany({ args, query }) {

    const tenantId = tenantContext.getTenantId();

    if (tenantId) {
      args.where = {
        ...args.where,
        id_institucion: BigInt(tenantId) 
      };
    }

    return query(args);
  }
  ,

  async findFirst({ args, query }) {

    const tenantId = tenantContext.getTenantId();

    if (tenantId) {
      args.where = {
        ...args.where,
        id_institucion: tenantId
      };
    }

    return query(args);
  },

  async findUnique({ args, query }) {

    const tenantId = tenantContext.getTenantId();

    if (tenantId) {
      args.where = {
        ...args.where,
        id_institucion: tenantId
      };
    }

    return query(args);
  },

  async create({ args, query }) {

    const tenantId = tenantContext.getTenantId();

    if (tenantId) {
      args.data.id_institucion = tenantId;
    }

    return query(args);
  }

},

})

module.exports = prisma