import { identity } from "./shared"

export type Nullable<T> = T | undefined | null

export type PrismGet<A, T> = <U extends A>(obj: Nullable<T>) => Nullable<U>
export type PrismSet<A, T> = <B extends A, V extends T>(obj: Nullable<V>) => (newValue: Nullable<B>) => Nullable<V>
export type PrismCompose<A, T> = <C>(p: Prism<C, A>) => Prism<C, T>

export interface Prism<A, T> {
	get: PrismGet<A, T>
	set: PrismSet<A, T>
	compose: PrismCompose<A, T>
}

export const createPrism = <A, T>(get: PrismGet<A, T>, set: PrismSet<A, T>, compose: PrismCompose<A, T>) => ({
	get,
	set,
	compose,
})

export const compose = <A, T, C>(prism1: Prism<A, T>, prism2: Prism<C, A>) => {
	const p1: Prism<C, T> = createPrism<C, T>(
		<U extends C>(obj: Nullable<T>) => prism2.get(prism1.get(obj)),
		<B extends C, V extends T>(obj: Nullable<V>) =>
			(value: Nullable<B>) =>
				prism1.set(obj)(prism2.set(prism1.get(obj))(value)),
		<U>(p2: Prism<U, C>) => compose(p1, p2),
	)
	return p1
}

export const prism = function <A, T extends Object>(key: keyof T) {
	const p: Prism<A, T> = createPrism(
		<U extends A>(obj: Nullable<T>) => (obj ? obj[key] : undefined) as Nullable<U>,
		<B extends A, V extends T>(obj: Nullable<V>) =>
			(value: Nullable<B>) =>
				({ ...(obj ?? {}), [key]: value }) as Nullable<V>,
		<C>(p2: Prism<C, A>) => compose(p, p2),
	)
	return p
}

export function view<A, T>(p: Prism<A, T>, obj: T) {
	return p.get(obj)
}
export function set<A, T>(p: Prism<A, T>, obj: T, value: Nullable<A>) {
	return p.set(obj)(value)
}
export function over<A, T>(p: Prism<A, T>, f: (x: Nullable<A>) => Nullable<A>, obj: T) {
	return p.set(obj)(f(p.get(obj)))
}

export function pick<T extends Object, K extends keyof T>(keys: K[], obj: T) {
	const p: Prism<Pick<T, K>, T> = createPrism<Pick<T, K>, T>(
		<U = T[K]>(o: Nullable<T>) => {
			let newObj: { [key in K]?: any } = {}

			Object.keys(o).forEach((key) => {
				const k = key as K
				if (keys.includes(k)) newObj[k] = o?.[k] ?? undefined
			})

			return newObj as U
		},
		<B extends Pick<T, K>, V extends T>(o: Nullable<V>) =>
			(_: B) =>
				identity(o),
		<C>(p2: Prism<C, Pick<T, K>>) => compose(p, p2),
	)

	return p.get(obj)
}

export const Prism = { view, set, over, pick }
