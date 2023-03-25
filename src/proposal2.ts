type Key = string | number | symbol

export interface Lens<A, K extends Key, S extends { [key in K]: any }> {
	readonly get: <T extends S>(obj: T) => A | T[K]
	readonly set: (a: A) => <T extends S>(obj: T) => T
}

export function lens<A, K extends Key, S extends { [key in K]: any } = any>(
	get: Lens<A, K, S>["get"],
	set: Lens<A, K, S>["set"],
): Lens<A, K, S> {
	return { get, set }
}

export function compose<O, E extends Key, A extends { [key in E]: O }, K extends Key, S extends { [key in K]: any }>(
	ab: Lens<A, K, S>,
	ab2: Lens<O, E, A>,
) {
	return lens<O, K, S>(
		(obj) => {
			const a = ab.get(obj)
			return ab2.get(a) as O
		},
		(o) => (obj) => {
			const a = ab.get(obj)
			const b = ab2.set(o)(a)
			return ab.set(b)(obj)
		},
	)
}

export const prop = <A, K extends keyof S, S = { [key in K]: A }>(key: K) =>
	lens<A, K, S>(
		(obj) => obj[key] as A,
		(value) => (obj) => ({ ...obj, [key]: value }),
	)
