import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

import { autoparam } from "../../definitions/automations"

export const FilterConditions = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
}

export const PrettyFilterConditions = {
  [FilterConditions.EQUAL]: "Equals",
  [FilterConditions.NOT_EQUAL]: "Not equals",
  [FilterConditions.GREATER_THAN]: "Greater than",
  [FilterConditions.LESS_THAN]: "Less than",
}

export const logictype = {
  continue: "continue",
  goto: "goto",
}

export const prettylogictype = {
  [logictype.continue]: "Continue If",
  [logictype.goto]: "Goto If",
}

export const definition: AutomationStepSchema = {
  name: "Condition",
  tagline:
    "{{inputs.ltype}} {{inputs.field}} {{inputs.condition}} {{inputs.value}} {{inputs.gotovalue}}",
  icon: "Branch2",
  description: "Conditionally halt automations or jump to another step",
  type: "LOGIC",
  internal: true,
  stepId: AutomationActionStepId.FILTER,
  inputs: {
    ltype: logictype.continue,
    condition: FilterConditions.EQUAL,
  },
  schema: {
    inputs: {
      properties: {
        ltype: {
          type: "string",
          title: "Logic Type",
          enum: Object.values(logictype),
          pretty: Object.values(prettylogictype),
        },
        field: {
          type: "string",
          title: "Reference Value",
        },
        condition: {
          type: "string",
          title: "Condition",
          enum: Object.values(FilterConditions),
          pretty: Object.values(PrettyFilterConditions),
        },
        value: {
          type: "string",
          title: "Comparison Value",
        },
        gotovalue: {
          type: "string",
          title: "Go to step no - valid only for Goto If",
        },
      },
      required: ["ltype", "field", "condition", "value"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
        result: {
          type: "boolean",
          description: "Whether the logic block passed",
        },
      },
      required: ["success", "result"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  try {
    let { ltype, field, condition, value, gotovalue } = inputs
    // coerce types so that we can use them
    if (!isNaN(value) && !isNaN(field)) {
      value = parseFloat(value)
      field = parseFloat(field)
    } else if (!isNaN(Date.parse(value)) && !isNaN(Date.parse(field))) {
      value = Date.parse(value)
      field = Date.parse(field)
    }
    let result = false
    if (
      ltype == logictype.goto &&
      !(gotovalue > 0 && gotovalue <= autoparam.maxstep)
    )
      return { success: true, result: true }
    if (
      ltype == logictype.continue &&
      typeof field !== "object" &&
      typeof value !== "object"
    ) {
      switch (condition) {
        case FilterConditions.EQUAL:
          result = field === value
          break
        case FilterConditions.NOT_EQUAL:
          result = field !== value
          break
        case FilterConditions.GREATER_THAN:
          result = field > value
          break
        case FilterConditions.LESS_THAN:
          result = field < value
          break
      }
    } else if (ltype == logictype.goto) {
      switch (condition) {
        case FilterConditions.EQUAL:
          if (field === value) autoparam.stepno = gotovalue - 1
          break
        case FilterConditions.NOT_EQUAL:
          if (field !== value) autoparam.stepno = gotovalue - 1
          break
        case FilterConditions.GREATER_THAN:
          if (field > value) autoparam.stepno = gotovalue - 1
          break
        case FilterConditions.LESS_THAN:
          if (field < value) autoparam.stepno = gotovalue - 1
          break
      }
      return { success: true, result: true }
    } else {
      result = false
    }
    return { success: true, result }
  } catch (err) {
    return { success: false, result: false }
  }
}
