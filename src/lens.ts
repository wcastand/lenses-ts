import { basis, compose } from "./shared"
import { Lens } from "./types"

export const lens = <A>(key: string): Lens<A> => {
	const l: Lens<A> = basis<A>(
		<T = unknown>(obj: T) => obj[key as keyof T] as A,
		(value) => (obj) => ({ ...obj, [key]: value }),
		(l2) => compose(l, l2),
	)
	return l
}
