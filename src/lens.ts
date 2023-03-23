export type LensGet<A, T> = <U extends A>(obj: T) => U
export type LensSet<A, T> = <B extends A, V extends T>(obj: V) => (newValue: B) => V
export type LensCompose<A, T> = <C>(lens: Lens<C, A>) => Lens<C, T>

export interface Lens<A, T> {
	get: LensGet<A, T>
	set: LensSet<A, T>
	compose: LensCompose<A, T>
}

export const createLens = <A, T>(get: LensGet<A, T>, set: LensSet<A, T>, compose: LensCompose<A, T>) => ({
	get,
	set,
	compose,
})

export const compose = <A, T, C>(lens1: Lens<A, T>, lens2: Lens<C, A>) => {
	const l1: Lens<C, T> = createLens<C, T>(
		<U extends C>(obj: T): U => lens2.get(lens1.get(obj)),
		<B extends C, V extends T>(obj: V) =>
			(value: B): V =>
				lens1.set(obj)(lens2.set(lens1.get(obj))(value)),
		<U>(l2: Lens<U, C>) => compose(l1, l2),
	)
	return l1
}

export const lens = function <A, T extends Object>(key: keyof T): Lens<A, T> {
	const l: Lens<A, T> = createLens(
		<U extends A>(obj: T) => obj[key] as U,
		<B extends A, V extends T>(obj: V) =>
			(value: B): V => ({ ...obj, [key]: value }),
		<C>(l2: Lens<C, A>) => compose(l, l2),
	)
	return l
}

export const Lens = {
	view: <A, T>(l: Lens<A, T>, obj: T): A => l.get(obj),
	set: <A, T>(l: Lens<A, T>, obj: T, value: A): T => l.set(obj)(value),
	over: <A, T>(l: Lens<A, T>, f: (x: A) => A, obj: T) => l.set(obj)(f(l.get(obj))),
}
