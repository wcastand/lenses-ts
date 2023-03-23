import { describe, expect, it } from "vitest"
import { Address, customer, userAddress } from "./data"
import { Lens, lens } from "./lens"

const LName = lens<string, { name: string }>("name")
const LNumber = lens<number, { number: number }>("number")
const LAddress = lens<Address, { address: Address }>("address")

describe("Lens", () => {
	it("view", () => {
		expect(Lens.view(LName, customer)).toEqual("will joe")
		expect(LAddress.get(customer)).toEqual(userAddress)
	})
	it("set", () => {
		expect(Lens.set(LName, customer, "John Smith")).toEqual({
			...customer,
			name: "John Smith",
		})
	})

	it("over", () => {
		expect(Lens.over(LName, (name) => name.toUpperCase(), customer)).toEqual({
			...customer,
			name: "WILL JOE",
		})
	})

	const LAddressNumber = LAddress.compose(LNumber)

	it("compose", () => {
		expect(LAddressNumber.get(customer)).toEqual(54)
		expect(Lens.set(LAddressNumber, customer, 42)).toEqual({
			...customer,
			address: { ...customer.address, number: 42 },
		})
	})
})
