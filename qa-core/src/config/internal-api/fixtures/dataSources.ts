const dataSources = {
  mongoDB: {
    datasource: {
      name: "MongoDB",
      source: "MONGODB",
      type: "datasource",
      config: {
        connectionString: "mongodb://pyramid.qa.budibase.net:27017",
        db: "admin.movies",
      },
    },

    fetchSchema: false,
  },
  postgresSQL: {
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
  },
}

export default dataSources
