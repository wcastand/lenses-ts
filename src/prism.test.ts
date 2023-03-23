import { describe, expect, it } from "vitest"
import { company2, company, Company, customer, customer2, Address, userAddress } from "./data"
import { Prism, prism } from "./prism"

const LCompany = prism<Company, { company?: Company }>("company")
const LAddress = prism<Address, { address?: Address }>("address")

const LCompanyAddress = LCompany.compose(LAddress)

describe("Prism", () => {
	it("view", () => {
		expect(Prism.view(LCompany, customer)).toEqual(company)
		expect(Prism.view(LCompany, customer2)).toEqual(undefined)
		expect(Prism.view(LAddress, customer2)).toEqual(userAddress)
		expect(Prism.view(LCompanyAddress, customer2)).toEqual(undefined)
	})
	it("set", () => {
		expect(Prism.set(LCompany, customer2, company)).toEqual({
			...customer2,
			company,
		})
		expect(Prism.set(LCompany, customer, company2)).toEqual({
			...customer,
			company: company2,
		})
	})

	it("over", () => {
		expect(Prism.over(LCompany, (_) => ({ ...company, name: "company 2" }), customer2)).toEqual({
			...customer2,
			company: { ...company, name: "company 2" },
		})
	})
})
