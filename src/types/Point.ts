export default class Point {
	x: number
	y: number
	[key: string]: number

	constructor(x: number, y:number) {
		this.x = x
		this.y = y
	}
	/**
	 * Converts an array of value pairs (array of two numbers) to an array of Point.
	 * @param arr An array of arrays with two numbers.
	 * @returns An array of Point.
	 */
	public static fromValuePairArray(arr: [number,number][]): Point[] {
		const points: Point[] = []
		arr.forEach((valuePair: [number,number]) => {
			points.push(this.fromValuePair(valuePair))
		})
		return points
	}
	/**
	 * Converts a an array of two numbers to Point.
	 * First value will be mapped to x and second to y.
	 * @param valuePair An array of two numbers.
	 * @returns The point representation of the value pair.
	 */
	public static fromValuePair(valuePair: [number,number]): Point {
		return new this(valuePair[0], valuePair[1])
	}
}