import { Lens, Prism } from "./types"

export function basis<A>(get: Lens<A>["get"], set: Lens<A>["set"], compose: Lens<A>["compose"]): Lens<A>
export function basis<A>(get: Prism<A>["get"], set: Prism<A>["set"], compose: Prism<A>["compose"]): Prism<A>
export function basis(get: any, set: any, compose: any): any {
	return { get, set, compose }
}

export function compose<A, O>(ab: Lens<A>, ab2: Lens<O>): Lens<O>
export function compose<A, O>(ab: Prism<A>, ab2: Prism<O>): Prism<O>
export function compose<_, O>(ab: any, ab2: any): any {
	return basis<O>(
		(s) => ab2.get(ab.get(s)),
		(o) => (s) => ab.set(ab2.set(o)(ab.get(s)))(s),
		(l) => compose(ab, compose(ab2, l)),
	)
}
