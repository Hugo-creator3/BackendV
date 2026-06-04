const { AsyncLocalStorage } = require('async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

module.exports = {

  run: (tenantId, callback) => {
    asyncLocalStorage.run({ tenantId }, callback)
  },

  getTenantId: () => {
    const store = asyncLocalStorage.getStore()
    return store ? store.tenantId : null
  }

}