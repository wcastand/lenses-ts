import { compose, lens, Lens } from "./proposal1"

export const prop = <S, T, K extends keyof T>(key: K, l: Lens<S, T>, source: S) => {
	const lw = lens<T, T[K]>(
		(src: T) => src[key],
		(v: T[K]) => (src: T) => ({ ...src, [key]: v }),
	)

	const lc = compose(l, lw)

	return {
		get: () => lc.get(source),
		set: (v: T[K]) => lc.set(v)(source),
		prop: <V extends keyof T[K]>(key: V) => prop<S, T[K], V>(key, lc, source),
	}
}

export const init = <S>(source: S) => {
	const l = { get: (src: S) => src, set: (v: S) => () => v }

	return {
		get: l.get(source),
		set: l.set(source)(),
		prop: <K extends keyof S>(key: K) => prop<S, S, K>(key, l, source),
	}
}
