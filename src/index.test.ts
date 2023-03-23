import { describe, expect, it } from "vitest"
import { Address, company, Company, customer, customer2, userAddress } from "./data"
import { Lens, propLens } from "./lens"
import { Prism, propPrism } from "./prism"

const LName = propLens<string, { name: string }>("name")
const LNumber = propLens<number, { number: number }>("number")
const LAddress = propLens<Address, { address: Address }>("address")

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

const LCompany = propPrism<{ company?: Company }, Company>("company")

describe("Prism", () => {
	it("view", () => {
		expect(Prism.view(LCompany, customer)).toEqual(company)
	})
	it("set", () => {
		expect(Prism.set(LCompany, customer2, company)).toEqual({
			...customer2,
			company,
		})
	})

	it("over", () => {
		expect(Prism.over(LCompany, (_) => ({ ...company, name: "company 2" }), customer2)).toEqual({
			...customer2,
			company: { ...company, name: "company 2" },
		})
	})
})
