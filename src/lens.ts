export type LensGet<A, T> = <U extends A>(obj: T) => U
export type LensSet<A, T> = <B extends A, V extends T>(obj: V) => (newValue: B) => V
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

export const compose = <A, T, C>(lens1: Lens<A, T>, lens2: Lens<C, A>) => {
	const l1: Lens<C, T> = lens<C, T>(
		<U extends C>(obj: T): U => lens2.get(lens1.get(obj)),
		<B extends C, V extends T>(obj: V) =>
			(value: B): V =>
				lens1.set(obj)(lens2.set(lens1.get(obj))(value)),
		<U>(other: Lens<U, C>) => compose(l1, other),
	)
	return l1
}

export const propLens = function <A, T extends Object>(key: keyof T): Lens<A, T> {
	const l: Lens<A, T> = lens(
		<U extends A>(obj: T): U => obj[key] as U,
		<B extends A, V extends T>(obj: V) =>
			(value: B): V => ({ ...obj, [key]: value }),
		<C>(l2: Lens<C, A>) => compose(l, l2),
	)
	return l
}

export const Lens = {
	view: <A, T>(lens: Lens<A, T>, obj: T): A => lens.get(obj),
	set: <A, T>(lens: Lens<A, T>, obj: T, value: A): T => lens.set(obj)(value),
	over: <A, T>(lens: Lens<A, T>, f: (x: A) => A, obj: T) => lens.set(obj)(f(lens.get(obj))),
}
