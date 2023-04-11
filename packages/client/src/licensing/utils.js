import { authStore } from "../stores/auth.js"
import { get } from "svelte/store"
import { Constants } from "@budibase/frontend-core"

const getLicense = () => {
  const user = get(authStore)
  if (user) {
    let newlic = {
      ...user.license,
      features: [
        "appBackups",
        "environmentVariables",
        "auditLogs",
        ...user.license.features,
      ],
    }
    return newlic
  }
}

export const isFreePlan = () => {
  const license = getLicense()
  if (license) {
    return license.plan.type === Constants.PlanType.FREE
  } else {
    // safety net - no license means free plan
    return true
  }
}
