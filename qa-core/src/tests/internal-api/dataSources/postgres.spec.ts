import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import dataSources from "../../../config/internal-api/fixtures/dataSources"

describe("Internal API - Data Sources: PostgresSQL", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Application>(api, accountsAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create an app with a data source", async () => {
    // Create app
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId
    // Add data source
    const [dataSourceResponse, dataSourceJson] = await config.dataSources.add(
      dataSources.postgresSQL
    )
    // Delete data source
    const deleteResponse = await config.dataSources.delete(
      <string>dataSourceJson._id,
      <string>dataSourceJson._rev
    )
  })
})
