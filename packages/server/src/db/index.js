const core = require("@budibase/backend-core")
const env = require("../environment")

exports.init = () => {
  const dbConfig = {
    replication: true,
    find: true,
  }

  if (env.isTest()) {
    dbConfig.inMemory = true
  }

  if (env.isCypress()) {
    dbConfig.allDbs = true
  }

  core.init({ db: dbConfig })
}
