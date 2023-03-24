export type Nullable<T> = T | undefined | null

export interface Lens<A> {
	readonly get: <S>(s: S) => A
	readonly set: (a: A) => <S = Object>(s: S) => S
	readonly compose: <O>(l: Lens<O>) => Lens<O>
}

export interface Prism<A> {
	readonly get: <S>(s: Nullable<S>) => Nullable<A>
	readonly set: (a: Nullable<A>) => <S = Object>(s: Nullable<S>) => Nullable<S>
	readonly compose: <O>(p: Prism<O>) => Prism<O>
}
