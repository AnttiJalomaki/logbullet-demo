import { test } from "node:test"
import assert from "node:assert/strict"
import { editDistance, partMoney, searchParts } from "./parts"
import {
  cartSubtotal,
  cleanCart,
  createPartsOrder,
  emptyCustomer,
  emptyPartsState,
  parsePartsState,
} from "./parts-order"

test("parts search tolerates spelling mistakes and transposed letters", () => {
  assert.equal(searchParts("baering")[0]?.id, "sealed-bearing")
  assert.equal(searchParts("oil fliter")[0]?.id, "engine-filter-set")
  assert.equal(editDistance("bearing", "baering"), 1)
  assert.equal(searchParts("unrelated gravel shovel").length, 0)
})
test("search understands Finnish accents, compounds and compact part numbers", () => {
  assert.equal(searchParts("moottorioljy")[0]?.id, "engine-oil")
  assert.equal(searchParts("LBFLT006")[0]?.id, "fuel-filter")
  assert.equal(searchParts("15221-43170")[0]?.id, "fuel-filter")
  assert.ok(
    searchParts("suodatin").some((part) => part.id === "engine-filter-set")
  )
  assert.equal(searchParts("   ").length, 10)
})
test("cart drops unknown and unavailable products and caps combined quantities", () => {
  assert.deepEqual(
    cleanCart([
      { id: "sealed-bearing", quantity: 20 },
      { id: "sealed-bearing", quantity: 20 },
      { id: "unknown", quantity: 2 },
      { id: "ecu-control-unit", quantity: 1 },
      { id: "engine-oil", quantity: NaN },
      { id: "fuel-filter", quantity: -2 },
      { id: "grease-cartridge", quantity: 1.9 },
    ]),
    [
      { id: "sealed-bearing", quantity: 24 },
      { id: "grease-cartridge", quantity: 1 },
    ]
  )
})
test("cart prices use integer cents without rounding drift", () => {
  assert.equal(
    cartSubtotal([
      { id: "grease-cartridge", quantity: 3 },
      { id: "engine-filter-set", quantity: 1 },
    ]),
    21970
  )
  assert.equal(partMoney(1490, "en"), "€14.90")
  assert.ok(partMoney(1490, "fi").includes("14,90"))
})
test("requests snapshot products, trim details and reject an empty cart", () => {
  const order = createPartsOrder(
    [{ id: "grease-cartridge", quantity: 3 }],
    { ...emptyCustomer, name: "  Forest Owner  " },
    "collection",
    "  Call on arrival  ",
    "LB-P-ABCDEF1234",
    "2026-09-07T12:00:00Z"
  )
  assert.equal(order.customer.name, "Forest Owner")
  assert.equal(order.notes, "Call on arrival")
  assert.equal(order.subtotalCents, 4470)
  assert.equal(order.lines[0].sku, "LB-LUB-003")
  assert.equal(order.lines[0].name.fi, "Rasvapatruuna · 400 g")
  assert.throws(() =>
    createPartsOrder([], emptyCustomer, "delivery", "", "id", "date")
  )
})
test("stored state validates requests and recalculates totals from saved price snapshots", () => {
  const order = createPartsOrder(
    [{ id: "sealed-bearing", quantity: 2 }],
    emptyCustomer,
    "delivery",
    "",
    "LB-P-ABCDEF1234",
    "2026-09-07T12:00:00Z"
  )
  order.lines[0].priceCents = 1900
  const raw = JSON.stringify({
    ...emptyPartsState,
    orders: [
      { ...order, subtotalCents: 999999 },
      { ...order, lines: [{ ...order.lines[0], quantity: -1 }] },
    ],
  })
  const state = parsePartsState(raw)
  assert.equal(state.orders.length, 1)
  assert.equal(state.orders[0].subtotalCents, 3800)
  for (const bad of [
    null,
    "broken json",
    "null",
    "[]",
    '{"version":2}',
    '{"version":1,"cart":"oops","orders":[{}]}',
  ])
    assert.deepEqual(parsePartsState(bad), emptyPartsState)
})
