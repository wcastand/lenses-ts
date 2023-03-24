import { basis, compose } from "./shared"
import { Prism } from "./types"

export const prism = <A>(key: string): Prism<A> => {
	const p: Prism<A> = basis<A>(
		<S>(obj: S) => {
			const k = key as keyof S
			return obj?.[k] ? (obj[k] as A) : undefined
		},
		(value) => (obj) => obj ? { ...obj, [key]: value } : undefined,
		(p2) => compose(p, p2),
	)
	return p
}
