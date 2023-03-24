import { describe, expect, it } from "vitest"
import { company2, company, Company, customer, customer2, Address, address, userAddress, Customer } from "./data"
import { over, prism, pick } from "./prism"

const PCompany = prism<Company, { company?: Company }>("company")
const PAddress = prism<Address, { address?: Address }>("address")
const PNumber = prism<number, { number: number }>("number")

const PCompanyAddress = PCompany.compose(PAddress)
const PCompanyAddressNumber = PCompanyAddress.compose(PNumber)

describe("Prism", () => {
	it("view", () => {
		expect(PCompany.get(customer)).toEqual(company)
		expect(PCompany.get(customer2)).toEqual(undefined)

		expect(PAddress.get(customer2)).toEqual(userAddress)

		expect(PCompanyAddress.get(customer2)).toEqual(undefined)

		expect(PCompanyAddressNumber.get(customer2)).toEqual(undefined)
		expect(PCompanyAddressNumber.get(customer)).toEqual(2)
	})

	it("set", () => {
		expect(PCompany.set(customer2)(company)).toEqual({ ...customer2, company })
		expect(PCompany.set(customer)(company2)).toEqual({ ...customer, company: company2 })

		expect(PCompanyAddress.set(customer)(userAddress)).toEqual({
			...customer,
			company: { ...company, address: userAddress },
		})

		expect(PCompanyAddressNumber.set(customer)(1)).toEqual({
			...customer,
			company: { ...company, address: { ...address, number: 1 } },
		})
		expect(PCompanyAddressNumber.set({})(1)).toEqual({
			company: { address: { number: 1 } },
		})
	})

	it("over", () => {
		const expectedC = { ...company, name: "company 2" }
		expect(over(PCompany, (_) => expectedC, customer2)).toEqual({ ...customer2, company: expectedC })

		const expectedA = { ...address, street: "company 2" }
		expect(over(PCompanyAddress, (_) => expectedA, customer2)).toEqual({
			...customer2,
			company: { address: expectedA },
		})
		expect(over(PCompanyAddressNumber, (n) => (n ? n + 1 : 1), customer2)).toEqual({
			...customer2,
			company: { address: { number: 1 } },
		})

		expect(over(PCompanyAddressNumber, (n) => (n ? n + 1 : 1), customer)).toEqual({
			...customer,
			company: { ...company, address: { ...address, number: 3 } },
		})
	})

	it("pick", () => {
		const lNameAndCompany = pick<Pick<Customer, "name" | "company">, "name" | "company">(["name", "company"])

		expect(lNameAndCompany.get(customer)).toEqual({ name: "will joe", company })

		const expected = { name: "John Smith", company: company2 }
		expect(lNameAndCompany.set(customer)(expected)).toEqual({
			...customer,
			...expected,
		})

		const res = lNameAndCompany.get(customer2)
		expect(res).toEqual({ name: "will joe" })
		// @ts-expect-error
		expect(res?.address).toBeFalsy()
	})
})
