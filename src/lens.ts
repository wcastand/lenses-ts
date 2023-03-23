export type LensGet<A, T> = (obj: T) => A
export type LensSet<A, T> = (obj: T) => (newValue: A) => T
export type LensCompose<A, T> = <C>(lens: Lens<C, A>) => Lens<C, T>

export interface Lens<A, T> {
	get: LensGet<A, T>
	set: LensSet<A, T>
	compose: LensCompose<A, T>
}

export const lens = <A, T>(get: LensGet<A, T>, set: LensSet<A, T>, compose: LensCompose<A, T>): Lens<A, T> => ({
	get,
	set,
	compose,
})

export const compose = <A, C, T>(lens1: Lens<A, T>, lens2: Lens<C, A>) => {
	const l1: Lens<C, T> = lens<C, T>(
		(obj: T): C => lens2.get(lens1.get(obj)),
		(obj: T) => (value: C): T => lens1.set(obj)(lens2.set(lens1.get(obj))(value)),
		<U>(other: Lens<U, C>) => compose(l1, other),
	)
	return l1
}

export const propLens = function <A, T extends Object>(key: keyof T): Lens<A, T> {
	const l: Lens<A, T> = lens(
		(obj: T): A => obj[key] as A,
		(obj: T) => (value: A): T => ({ ...obj, [key]: value }),
		<C>(l2: Lens<C, A>) => compose<A, C, T>(l, l2),
	)
	return l
}

export const Lens = {
	view: <A, T>(lens: Lens<A, T>, obj: T): A => lens.get(obj),
	set: <A, T>(lens: Lens<A, T>, obj: T, value: A): T => lens.set(obj)(value),
	over: <A, T>(lens: Lens<A, T>, f: (x: A) => A, obj: T) => lens.set(obj)(f(lens.get(obj))),
}
