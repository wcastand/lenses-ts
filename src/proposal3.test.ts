import { describe, expect, it } from "vitest"
import { company, customer } from "./data"
import { init } from "./proposal3"

describe("Experiment", () => {
	const l = init(customer)
	it("get", () => {
		expect(l.prop("name").get()).toEqual("will joe")
		expect(l.prop("company").get()).toEqual(company)
		expect(l.prop("address").get()).toEqual(customer.address)

		expect(l.prop("company").prop("address").get()).toEqual(customer.company.address)
		expect(l.prop("address").prop("number").get()).toBe(54)
		expect(init(company).prop("address").prop("number").get()).toBe(2)
		expect(l.prop("company").prop("address").prop("number").get()).toBe(2)
	})
	it("set", () => {
		expect(l.prop("name").set("new name")).toEqual({ ...customer, name: "new name" })
		expect(l.prop("company").set({ ...company, name: "new name" })).toEqual({
			...customer,
			company: { ...company, name: "new name" },
		})
		expect(l.prop("address").set({ ...customer.address, number: 1 })).toEqual({
			...customer,
			address: { ...customer.address, number: 1 },
		})
		expect(
			l
				.prop("company")
				.prop("address")
				.set({ ...company.address, number: 1 }),
		).toEqual({ ...customer, company: { ...company, address: { ...customer.company.address, number: 1 } } })
		expect(l.prop("address").prop("number").set(1)).toEqual({
			...customer,
			address: { ...customer.address, number: 1 },
		})
		expect(init(company).prop("address").prop("number").set(1)).toEqual({
			...customer.company,
			address: { ...customer.company.address, number: 1 },
		})
		expect(l.prop("company").prop("address").prop("number").set(1)).toEqual({
			...customer,
			company: { ...customer.company, address: { ...customer.company.address, number: 1 } },
		})
	})
})
