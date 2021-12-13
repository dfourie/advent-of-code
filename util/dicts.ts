/**
 * THis object accumulate unique values onto their responding keys
 */
export class AccumulatorDict<KEY extends keyof any, VAL> {
	public dict: Partial<Record<KEY, VAL[]>> = {};

	addVal(key: KEY, val: VAL) {
		if (key in this.dict) {
			this.dict[key]?.push(val);
		} else {
			this.dict[key] = [val];
		}
	}
	public [Symbol.iterator]() {
		return Object.keys(this.dict);
	}
}
