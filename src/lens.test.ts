import { describe, expect, it } from "vitest"
import { Address, company, Customer, customer, userAddress } from "./data"
import { over, pick, lens } from "./lens"

const LName = lens<string, { name: string }>("name")
const LNumber = lens<number, { number: number }>("number")
const LAddress = lens<Address, { address: Address }>("address")

const LAddressNumber = LAddress.compose(LNumber)

describe("Lens", () => {
	it("view", () => {
		expect(LName.get(customer)).toEqual("will joe")
		expect(LAddress.get(customer)).toEqual(userAddress)

		expect(LAddressNumber.get(customer)).toEqual(54)
	})
	it("set", () => {
		expect(LName.set(customer)("John Smith")).toEqual({
			...customer,
			name: "John Smith",
		})

		expect(LAddressNumber.set(customer)(42)).toEqual({
			...customer,
			address: { ...customer.address, number: 42 },
		})
	})

	it("over", () => {
		expect(over(LName, (name) => name.toUpperCase(), customer)).toEqual({
			...customer,
			name: "WILL JOE",
		})

		expect(over(LAddressNumber, (n) => n + 2, customer)).toEqual({
			...customer,
			address: { ...customer.address, number: customer.address.number + 2 },
		})
	})

	it("pick", () => {
		const LNameAndCompany = pick<Pick<Customer, "name" | "company">, "name" | "company">(["name", "company"])
		const res = LNameAndCompany.get(customer)
		expect(res).toEqual({ name: "will joe", company })
		// @ts-expect-error
		expect(res.address).toBeFalsy()
	})
})
