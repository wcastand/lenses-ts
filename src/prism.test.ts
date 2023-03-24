import { describe, expect, it } from "vitest"
import { company2, company, Company, customer, customer2, Address, address, userAddress } from "./data"
import { prism } from "./prism"

const PCompany = prism<Company>("company")
const PAddress = prism<Address>("address")
const PNumber = prism<number>("number")

const PCompanyAddress = PCompany.compose(PAddress)
const PCompanyAddressNumber = PCompanyAddress.compose(PNumber)

const source = { a: { b: { c: { d: 1 } } } }
const expected = { a: { b: { c: { d: 2 } } } }
const ua = { a: undefined }
const ub = { a: { b: undefined } }
const uc = { a: { b: { c: undefined } } }
const ud = { a: { b: { c: { d: undefined } } } }
const udd = { a: { b: { c: {} } } }

const la = prism<{ b: { c: { d: number } } }>("a")
const lb = la.compose(prism<{ c: { d: number } }>("b"))
const lc = lb.compose(prism<{ d: number }>("c"))
const ld = lc.compose(prism<number>("d"))

const lbb = prism<{ c: { d: number } }>("b")
const lcc = prism<{ d: number }>("c")
const ldd = prism<number>("d")

const lll = la.compose(lbb).compose(lcc).compose(ldd)
const llll = la.compose(lbb.compose(lcc.compose(ldd)))

describe("Prism", () => {
	it("view", () => {
		expect(lll.get(source)).toBe(1)
		expect(llll.get(source)).toBe(1)
		expect(ld.get(source)).toBe(1)

		expect(lll.get(undefined)).toBe(undefined)
		expect(llll.get(undefined)).toBe(undefined)
		expect(ld.get(undefined)).toBe(undefined)

		expect(lll.get(ua)).toBe(undefined)
		expect(llll.get(ua)).toBe(undefined)
		expect(ld.get(ua)).toBe(undefined)

		expect(lll.get(ub)).toBe(undefined)
		expect(llll.get(ub)).toBe(undefined)
		expect(ld.get(ub)).toBe(undefined)

		expect(lll.get(uc)).toBe(undefined)
		expect(llll.get(uc)).toBe(undefined)
		expect(ld.get(uc)).toBe(undefined)

		expect(lll.get(ud)).toBe(undefined)
		expect(llll.get(ud)).toBe(undefined)
		expect(ld.get(ud)).toBe(undefined)

		expect(lll.get(udd)).toBe(undefined)
		expect(llll.get(udd)).toBe(undefined)
		expect(ld.get(udd)).toBe(undefined)

		expect(PCompany.get(customer)).toEqual(company)
		expect(PCompany.get(customer2)).toEqual(undefined)

		expect(PAddress.get(customer2)).toEqual(userAddress)

		expect(PCompanyAddress.get(customer2)).toEqual(undefined)
		expect(PCompanyAddressNumber.get(customer2)).toEqual(undefined)
		expect(PCompanyAddressNumber.get(customer)).toEqual(2)

		const cc: any = {}
		expect(PCompanyAddressNumber.get(cc)).toEqual(undefined)
	})

	it("set", () => {
		expect(lll.set(2)(source)).toEqual(expected)
		expect(llll.set(2)(source)).toEqual(expected)
		expect(ld.set(2)(source)).toEqual(expected)

		expect(lll.set(2)(undefined)).toEqual(undefined)
		expect(llll.set(2)(undefined)).toEqual(undefined)
		expect(ld.set(2)(undefined)).toEqual(undefined)

		expect(lll.set(2)(ua)).toEqual(ua)
		expect(llll.set(2)(ua)).toEqual(ua)
		expect(ld.set(2)(ua)).toEqual(ua)

		expect(lll.set(2)(ub)).toEqual(ub)
		expect(llll.set(2)(ub)).toEqual(ub)
		expect(ld.set(2)(ub)).toEqual(ub)

		expect(lll.set(2)(uc)).toEqual(uc)
		expect(llll.set(2)(uc)).toEqual(uc)
		expect(ld.set(2)(uc)).toEqual(uc)

		expect(lll.set(2)(ud)).toEqual({ a: { b: { c: { d: 2 } } } })
		expect(llll.set(2)(ud)).toEqual({ a: { b: { c: { d: 2 } } } })
		expect(ld.set(2)(ud)).toEqual({ a: { b: { c: { d: 2 } } } })

		expect(lll.set(2)(udd)).toEqual({ a: { b: { c: { d: 2 } } } })
		expect(llll.set(2)(udd)).toEqual({ a: { b: { c: { d: 2 } } } })
		expect(ld.set(2)(udd)).toEqual({ a: { b: { c: { d: 2 } } } })

		expect(PCompany.set(company)(customer2)).toEqual({ ...customer2, company })
		expect(PCompany.set(company2)(customer)).toEqual({ ...customer, company: company2 })

		expect(PCompanyAddress.set(userAddress)(customer)).toEqual({
			...customer,
			company: { ...company, address: userAddress },
		})

		expect(PCompanyAddressNumber.set(1)(customer)).toEqual({
			...customer,
			company: { ...company, address: { ...address, number: 1 } },
		})
		expect(PCompanyAddressNumber.set(1)({})).toEqual({ company: undefined })
	})

	it("over", () => {})

	it("pick", () => {})
})
