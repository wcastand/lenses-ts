import { basis, compose } from "./shared"
import { Lens } from "./types"

export const lens = <A>(key: string): Lens<A> => {
	const l: Lens<A> = basis<A>(
		<S>(obj: S) => obj[key as keyof S] as A,
		(value) => (obj) => ({ ...obj, [key]: value }),
		(l2) => compose(l, l2),
	)
	return l
}
