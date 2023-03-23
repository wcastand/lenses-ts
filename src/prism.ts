export type Nullable<T> = T | undefined | null

export type PrismGet<T, A> = (obj: T) => Nullable<A>
export type PrismSet<T, A> = (obj: T) => (newValue: Nullable<A>) => T

export interface Prism<T extends Record<string, any>, A> {
	get: PrismGet<T, A>
	set: PrismSet<T, A>
}

//generic property prism
export const propPrism = function <T extends Record<string, any>, A>(key: string): Prism<T, A> {
	return {
		get: (obj: T): Nullable<A> => obj[key] ?? undefined,
		set: (obj: T) => (value: Nullable<A>): T => ({ ...obj, [key]: value }),
	}
}

export const Prism = {
	view: <T extends Record<string, any>, A>(prism: Prism<T, A>, obj: T): Nullable<A> => prism.get(obj),
	set: <T extends Record<string, any>, A>(prism: Prism<T, A>, obj: T, value: Nullable<A>): T => prism.set(obj)(value),
	over: <T extends Record<string, any>, A>(prism: Prism<T, A>, f: (x: Nullable<A>) => Nullable<A>, obj: T) =>
		prism.set(obj)(f(prism.get(obj))),
}
