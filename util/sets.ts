export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	const _intersection = new Set<T>();
	setB.forEach(elem => {
		if (setA.has(elem)) {
			_intersection.add(elem);
		}
	});
	return _intersection;
}

export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	let _difference = new Set<T>(setA as any);

	setB.forEach(elem => {
		_difference.delete(elem);
	});
	return _difference;
}

export function isSetEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
	let output = true;

	if (setA.size !== setB.size) {
		return false;
	}

	setA.forEach(entry => {
		if (!setB.has(entry)) {
			output = false;
		}
	});

	return output;
}
export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	let _union = new Set<T>(setA as any);

	setB.forEach(elem => {
		_union.add(elem);
	});
	return _union;
}
