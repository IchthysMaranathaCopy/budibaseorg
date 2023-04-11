import * as feature from "./features"

const licensing = {
  ...feature,
  features: ["appBackups", "environmentVariables", "auditLogs"],
}

export default licensing
