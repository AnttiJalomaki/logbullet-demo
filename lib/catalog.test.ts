import { test } from "node:test"
import assert from "node:assert/strict"
import {
  getMachine,
  normalizeOptions,
  toggleOption,
  calculateEstimate,
} from "./catalog"
import { parseDemoOrder } from "./order"
const original = getMachine("logbullet")!
test("an extended crane includes its required manual valve in the estimate", () => {
  const ids = normalizeOptions(original, ["crane42"])
  assert.deepEqual(ids, ["crane42", "manual"])
  assert.equal(calculateEstimate(original, ids).total, 35998)
})
test("electric controls replace manual controls without billing twice for hydraulic outputs", () => {
  const ids = toggleOption(
    original,
    ["crane42", "manual", "hydraulics"],
    "electric"
  )
  assert.deepEqual(ids, ["crane42", "electric"])
  assert.equal(calculateEstimate(original, ids).total, 37243)
})
test("adding a separate hydraulic output replaces electric controls and preserves crane compatibility", () => {
  const ids = toggleOption(original, ["crane42", "electric"], "hydraulics")
  assert.deepEqual(ids, ["crane42", "hydraulics", "manual"])
})
test("query options cannot add duplicates, other models' options or two mutually exclusive grapples", () => {
  const ids = normalizeOptions(original, [
    "torque",
    "torque",
    "combi",
    "energy",
    "energy-extra",
    "unknown",
  ])
  assert.deepEqual(ids, ["torque", "energy"])
  assert.equal(calculateEstimate(original, ids).total, 36415)
})
test("Megamax versions replace each other and use published total prices", () => {
  const m = getMachine("megamax")!
  assert.equal(calculateEstimate(m, ["combi"]).total, 98000)
  const ids = toggleOption(m, ["combi"], "harvester")
  assert.deepEqual(ids, ["harvester"])
  assert.equal(calculateEstimate(m, ids).total, 96000)
})
test("unpriced Superbullet equipment stays explicit instead of becoming free", () => {
  const m = getMachine("superbullet")!
  const estimate = calculateEstimate(m, ["ac", "farma"])
  assert.equal(estimate.total, 54000)
  assert.equal(estimate.unpriced, true)
  assert.equal(estimate.equipment.length, 2)
})
test("invalid, corrupt or incomplete local receipts do not crash the confirmation", () => {
  assert.equal(parseDemoOrder("not-json"), null)
  assert.equal(parseDemoOrder(null), null)
  assert.equal(
    parseDemoOrder(
      JSON.stringify({ version: 1, status: "demo-saved", id: "bad" })
    ),
    null
  )
})
test("a complete demo order survives serialization", () => {
  const order = {
    version: 1,
    id: "LB-DEMO-TEST",
    createdAt: "2026-09-07T12:00:00Z",
    locale: "en",
    model: "logbullet",
    options: ["torque"],
    estimate: 36035,
    unpriced: false,
    contact: {
      name: "Demo Forester",
      email: "demo@example.com",
      country: "Finland",
      phone: "",
      company: "",
      notes: "",
    },
    status: "demo-saved",
  }
  assert.deepEqual(parseDemoOrder(JSON.stringify(order)), order)
})

test("browser language negotiation selects the best supported language", async () => {
  const { preferredLocale } = await import("./i18n")
  assert.equal(preferredLocale("sv-SE,fi-FI;q=0.9,en;q=0.8"), "fi")
  assert.equal(preferredLocale("fi;q=0.2,en;q=0.9"), "en")
  assert.equal(preferredLocale("fi;q=0,en;q=0.9"), "en")
  assert.equal(preferredLocale(null), "en")
})
