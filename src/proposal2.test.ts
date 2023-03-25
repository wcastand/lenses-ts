import { describe, expect, it } from "vitest"
import { Address, Company, customer } from "./data"
import { compose, prop } from "./proposal2"

const lName = prop<string, "name">("name")
const lNumber = prop<number, "number">("number")
const lAddress = prop<Address, "address">("address")
const lCompany = prop<Company, "company">("company")

const lCompanyAddress = compose(lCompany, lAddress)
const lAddressNumber = compose(lAddress, lNumber)
const lCompanyAddressNumber = compose(lCompanyAddress, lNumber)

// not possible for some reason typescriptestque
// const lCompanyAddressNumber2 = compose(lCompany, lAddressNumber)

describe("Lens", () => {
	it("view", () => {
		expect(lName.get(customer)).toBe("will joe")
		expect(lCompany.get(customer)).toEqual(customer.company)
		expect(lAddress.get(customer)).toEqual(customer.address)
		expect(lCompanyAddress.get(customer)).toEqual(customer.company.address)
		expect(lNumber.get(customer.address)).toBe(54)
		expect(lAddressNumber.get(customer.company)).toBe(2)
		expect(lCompanyAddressNumber.get(customer)).toBe(2)
	})

	it("set", () => {
		expect(lName.set("new name")(customer)).toEqual({ ...customer, name: "new name" })
		expect(lCompany.set({ ...customer.company, name: "new name" })(customer)).toEqual({
			...customer,
			company: { ...customer.company, name: "new name" },
		})
		expect(lAddress.set({ ...customer.address, number: 1 })(customer)).toEqual({
			...customer,
			address: { ...customer.address, number: 1 },
		})
		expect(lCompanyAddress.set({ ...customer.company.address, number: 1 })(customer)).toEqual({
			...customer,
			company: { ...customer.company, address: { ...customer.company.address, number: 1 } },
		})
		expect(lNumber.set(1)(customer.address)).toEqual({ ...customer.address, number: 1 })
		expect(lAddressNumber.set(1)(customer.company)).toEqual({
			...customer.company,
			address: { ...customer.company.address, number: 1 },
		})
		expect(lCompanyAddressNumber.set(1)(customer)).toEqual({
			...customer,
			company: { ...customer.company, address: { ...customer.company.address, number: 1 } },
		})
	})
})
