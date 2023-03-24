export type Nullable<T> = T | undefined | null

export interface Lens<A> {
	readonly get: <T>(s: T) => A
	readonly set: (a: A) => <T>(s: T) => T
	readonly compose: <O>(l: Lens<O>) => Lens<O>
}

export interface Prism<A> {
	readonly get: <T>(s: Nullable<T>) => Nullable<A>
	readonly set: (a: Nullable<A>) => <T>(s: Nullable<T>) => Nullable<T>
	readonly compose: <O>(p: Prism<O>) => Prism<O>
}
