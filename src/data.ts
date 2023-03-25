export type Address = {
	street: string
	add?: string
	number: number
	city: string
	country: string
	countryCode: string
}

export type Company = {
	name: string
	address: Address
}

export type Customer = {
	name: string
	company: Company
	address: Address
}

export const address: Address = {
	street: "etst",
	number: 2,
	city: "BBorr",
	country: "France",
	countryCode: "FR",
}

export const userAddress: Address = {
	street: "street",
	number: 54,
	city: "User",
	country: "France",
	countryCode: "FR",
}

export const company: Company = {
	name: "compents",
	address,
}

export const customer: Customer = {
	name: "will joe",
	company,
	address: userAddress,
}
