import * as feature from "./features"

const licensing = {
  features: ["appBackups", "environmentVariables", "auditLogs"],
  ...feature,
}

export default licensing
