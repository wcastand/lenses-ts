import { describe, expect, it } from "vitest"
import { company2, company, Company, customer, customer2, Address, userAddress } from "./data"
import { Prism, prism } from "./prism"

const PCompany = prism<Company, { company?: Company }>("company")
const PAddress = prism<Address, { address?: Address }>("address")
const PNumber = prism<number, { number: number }>("number")

const PCompanyAddress = PCompany.compose(PAddress)
const PCompanyAddressNumber = PCompanyAddress.compose(PNumber)

describe("Prism", () => {
	it("view", () => {
		expect(Prism.view(PCompany, customer)).toEqual(company)
		expect(Prism.view(PCompany, customer2)).toEqual(undefined)

		expect(Prism.view(PAddress, customer2)).toEqual(userAddress)

		expect(Prism.view(PCompanyAddress, customer2)).toEqual(undefined)

		expect(Prism.view(PCompanyAddressNumber, customer2)).toEqual(undefined)
		expect(Prism.view(PCompanyAddressNumber, customer)).toEqual(2)
	})
	it("set", () => {
		expect(Prism.set(PCompany, customer2, company)).toEqual({ ...customer2, company })
		expect(Prism.set(PCompany, customer, company2)).toEqual({ ...customer, company: company2 })
	})

	it("over", () => {
		expect(Prism.over(PCompany, (_) => ({ ...company, name: "company 2" }), customer2)).toEqual({
			...customer2,
			company: { ...company, name: "company 2" },
		})
	})
})
