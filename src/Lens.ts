export type Lens<S, O> = {
	get: (src: S) => O
	set: (v: O) => (src: S) => S
}

export const lens = <S, O>(get: Lens<S, O>["get"], set: Lens<S, O>["set"]): Lens<S, O> => ({ get, set })
export const compose = <S, O, T>(l: Lens<S, O>, l2: Lens<O, T>) =>
	lens<S, T>(
		(src: S) => l2.get(l.get(src)),
		(v: T) => (src: S) => l.set(l2.set(v)(l.get(src)))(src),
	)

export const prop = <S, K extends keyof S>(key: K) =>
	lens<S, S[K]>(
		(src: S) => src[key],
		(v: S[K]) => (src: S) => ({ ...src, [key]: v }),
	)
