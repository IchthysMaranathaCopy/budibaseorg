import { Response } from "node-fetch"
import { Datasource } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"
import { responseMessage } from "../fixtures/types/responseMessage"

export default class DataSources {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async getIntegrations(): Promise<[Response, any]> {
    const response = await this.api.get(`/integrations`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    const integrationsCount = Object.keys(json).length
    expect(integrationsCount).toBe(16)
    return [response, json]
  }

  async getAll(): Promise<[Response, Datasource[]]> {
    const response = await this.api.get(`/datasources`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThan(0)
    return [response, json]
  }

  async getTable(dataSourceId: string): Promise<[Response, Datasource]> {
    const response = await this.api.get(`/datasources/${dataSourceId}`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(dataSourceId)
    return [response, json]
  }

  async add(): Promise<[Response, Datasource]> {
    //temporarily using a hard coded datasource to test 500 error
    const body = {
      datasource: {
        name: "PostgresSQL",
        plus: true,
        source: "POSTGRES",
        type: "datasource",
        config: {
          database: "northwind",
          host: "pyramid.qa.budibase.net",
          password: "redacted",
          port: 5432,
          schema: "public",
          user: "qa",
        },
      },
      fetchSchema: true,
    }
    const response = await this.api.post(`/datasources`, { body })
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()

    return [response, json]
  }

  async delete(dataSourceId: string, revId: string): Promise<Response> {
    const response = await this.api.del(`/datasources/${dataSourceId}/${revId}`)
    expect(response).toHaveStatusCode(200)
    return response
  }
}
