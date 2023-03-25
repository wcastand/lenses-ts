import { describe, expect, it } from "vitest"
import { Address, Company, Customer, customer } from "./data"
import { compose, prop } from "./proposal1"

const lCustomerName = prop<Customer, "name">("name")
const lCustomerCompany = prop<Customer, "company">("company")
const lCustomerAddress = prop<Customer, "address">("address")

const lAddressNumber = prop<Address, "number">("number")

const lCompanyAddress = prop<Company, "address">("address")

const lCompanyAddressNumber = compose(lCompanyAddress, lAddressNumber)
const lCustomerCompanyAddressNumber = compose(lCustomerCompany, lCompanyAddressNumber)

describe("Experiment", () => {
	it("get", () => {
		expect(lCustomerName.get(customer)).toBe("will joe")
		expect(lCustomerCompany.get(customer)).toEqual(customer.company)
		expect(lCustomerAddress.get(customer)).toEqual(customer.address)
		// weird, Customer and Company are not the same type for this case (both got an address property)
		expect(lCompanyAddress.get(customer)).toEqual(customer.address)
		expect(lCustomerAddress.get(customer)).toEqual(customer.address)
		expect(lAddressNumber.get(customer.address)).toBe(54)
		expect(lCompanyAddressNumber.get(customer.company)).toBe(2)
		expect(lCustomerCompanyAddressNumber.get(customer)).toBe(2)
	})
	it("set", () => {
		expect(lCustomerName.set("new name")(customer)).toEqual({ ...customer, name: "new name" })
		expect(lCustomerCompany.set({ ...customer.company, name: "new name" })(customer)).toEqual({
			...customer,
			company: { ...customer.company, name: "new name" },
		})
		expect(lCustomerAddress.set({ ...customer.address, number: 1 })(customer)).toEqual({
			...customer,
			address: { ...customer.address, number: 1 },
		})
		expect(lCompanyAddress.set({ ...customer.company.address, number: 1 })(customer.company)).toEqual({
			...customer.company,
			address: { ...customer.company.address, number: 1 },
		})
		expect(lCustomerAddress.set({ ...customer.address, number: 1 })(customer)).toEqual({
			...customer,
			address: { ...customer.address, number: 1 },
		})
		expect(lAddressNumber.set(1)(customer.address)).toEqual({ ...customer.address, number: 1 })
		expect(lCompanyAddressNumber.set(1)(customer.company)).toEqual({
			...customer.company,
			address: { ...customer.company.address, number: 1 },
		})
		expect(lCustomerCompanyAddressNumber.set(1)(customer)).toEqual({
			...customer,
			company: { ...customer.company, address: { ...customer.company.address, number: 1 } },
		})
	})
})
