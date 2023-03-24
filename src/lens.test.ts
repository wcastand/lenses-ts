import { describe, expect, it } from "vitest"
import { address, Address, company, Company, Customer, customer, userAddress } from "./data"
import { lens } from "./lens"

const lName = lens<string>("name")
const lNumber = lens<number>("number")
const lAddress = lens<Address>("address")
const lCompany = lens<Company>("company")

const lAddressNumber = lAddress.compose(lNumber)
const lCompanyAddress = lCompany.compose(lAddress)
const lCompanyAddressNumber = lCompanyAddress.compose(lNumber)

const source = { a: { b: { c: { d: 1 } } } }
const expected = { a: { b: { c: { d: 2 } } } }

const la = lens<{ b: { c: { d: number } } }>("a")
const lb = la.compose(lens<{ c: { d: number } }>("b"))
const lc = lb.compose(lens<{ d: number }>("c"))
const ld = lc.compose(lens<number>("d"))

const lbb = lens<{ c: { d: number } }>("b")
const lcc = lens<{ d: number }>("c")
const ldd = lens<number>("d")

const lll = la.compose(lbb).compose(lcc).compose(ldd)
const llll = la.compose(lbb.compose(lcc.compose(ldd)))

describe("Lens", () => {
	it("view", () => {
		expect(lll.get(source)).toBe(1)
		expect(llll.get(source)).toBe(1)
		expect(ld.get(source)).toBe(1)

		expect(lName.get({ name: "John" })).toBe("John")
		expect(lName.get({ name: "John", address: userAddress })).toBe("John")
		expect(lName.get(customer)).toBe("will joe")
		expect(lAddressNumber.get(customer)).toBe(54)
		expect(lAddressNumber.get<Customer>(customer)).toBe(54)

		expect(lCompany.get<Customer>(customer)).toBe(company)
		expect(lCompanyAddress.get<Customer>(customer)).toBe(address)
		expect(lCompanyAddressNumber.get<Customer>(customer)).toBe(2)
	})

	it("set", () => {
		expect(lll.set(2)(source)).toEqual(expected)
		expect(llll.set(2)(source)).toEqual(expected)
		expect(ld.set(2)(source)).toEqual(expected)

		expect(lName.set("Will")({ name: "John" })).toEqual({ name: "Will" })
		expect(lName.set("Will")({ name: "John", address: userAddress })).toEqual({ name: "Will", address: userAddress })
		expect(lName.set("Will")(customer)).toEqual({ ...customer, name: "Will" })
		expect(lAddressNumber.set(1)(customer)).toEqual({ ...customer, address: { ...userAddress, number: 1 } })
		expect(lAddressNumber.set(2)<Customer>(customer)).toEqual({ ...customer, address: { ...userAddress, number: 2 } })

		// @ts-expect-error
		expect(lName.set("Will")<Customer>({})).toEqual({ name: "Will" })
	})

	it("over", () => {})

	it("pick", () => {})
})
