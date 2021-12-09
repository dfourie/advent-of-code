import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 8;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/08/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/08/data.txt
// problem url  : https://adventofcode.com/2021/day/8

function parseInput(input: string) {
	//split
	return input.split("\n").map(line =>
		line
			.trim()
			.split("|")
			.map(value => value.trim().split(" "))
	);
}

async function p2021day8_part1(input: string, ...params: any[]) {
	const lines = parseInput(input);
	let sum = 0;
	lines.forEach(([signal, output]) => {
		output.forEach(value => {
			switch (value.length) {
				// For digit 1
				case 2:
				// for digit 4
				case 4:

				//for digit 7
				case 3:
				// for digit 8
				case 7:
					sum = sum + 1;
					break;
				default:
					// do nothing for now
					break;
			}
		});
	});
	return sum;
}
type TSegment = "topLeft" | "top" | "topRight" | "middle" | "bottomLeft" | "bottom" | "bottomRight";

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	const _intersection = new Set<T>();
	setB.forEach(elem => {
		if (setA.has(elem)) {
			_intersection.add(elem);
		}
	});
	return _intersection;
}

function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	let _difference = new Set<T>(setA as any);

	setB.forEach(elem => {
		_difference.delete(elem);
	});
	return _difference;
}

function isSetEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
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

const digitLookup: Record<number, Set<TSegment>> = {
	0: new Set(["topLeft", "top", "topRight", "bottomLeft", "bottom", "bottomRight"]), //6
	1: new Set(["topRight", "bottomRight"]), //2
	2: new Set(["top", "topRight", "middle", "bottomLeft", "bottom"]), //5
	3: new Set(["top", "bottomRight", "middle", "topRight", "bottom"]), //5
	4: new Set(["topLeft", "topRight", "middle", "bottomRight"]), //4
	5: new Set(["topLeft", "top", "middle", "bottomRight", "bottom"]), //5
	6: new Set(["topLeft", "top", "middle", "bottomLeft", "bottom", "bottomRight"]), //6
	7: new Set(["top", "topRight", "bottomRight"]), //4
	8: new Set(["topLeft", "top", "topRight", "middle", "bottomLeft", "bottom", "bottomRight"]), //7
	9: new Set(["topLeft", "top", "topRight", "middle", "bottom", "bottomRight"]), //6
};

let length5Intersection = intersection(digitLookup[2], digitLookup[3]);
length5Intersection = intersection(length5Intersection, digitLookup[5]);
length5Intersection = difference(digitLookup[8], length5Intersection);

let length6Intersection = intersection(digitLookup[0], digitLookup[6]);
length6Intersection = intersection(length6Intersection, digitLookup[9]);
length6Intersection = difference(digitLookup[8], length6Intersection);

async function p2021day8_part2(input: string, ...params: any[]) {
	const displays = parseInput(input);
	let sum = 0;
	displays.forEach(([signal, output]) => {
		const encoder: Record<number, string> = {};
		// Map a character to potencial segments. When there is only one segment per character, the problem is solved.
		const segments: Record<string, Set<TSegment>> = {};
		// const chars: string[] = ;
		["a", "b", "c", "d", "e", "f", "g"].forEach(char => {
			// Populate each sement with total possible values
			segments[char] = digitLookup[8];
		});

		/**
		 * Removes the value from all segments that are not finalised
		 * @param value
		 */
		function RemoveAllSubsets() {
			//Loop through each subset
			Object.keys(segments).forEach(segment => {
				const subset = segments[segment];

				//loop through each entry again, and remove all non-equal subsets

				Object.keys(segments).forEach(testSegment => {
					if (!isSetEqual(subset, segments[testSegment]) && segments[testSegment].size >= subset.size) {
						const diff = difference(segments[testSegment], subset);

						segments[testSegment] = diff;
					}
				});
			});
		}
		//

		//First do the easy digits
		[...signal, ...output].forEach(value => {
			switch (value.length) {
				// For digit 1
				case 2:
					encoder[1] = value;
					value.split("").forEach(value => {
						segments[value] = intersection(segments[value], digitLookup[1]);
					});
					break;
				// for digit 4
				case 4:
					encoder[4] = value;
					value.split("").forEach(value => {
						segments[value] = intersection(segments[value], digitLookup[4]);
					});
					break;
				//for digit 7
				case 3:
					encoder[7] = value;
					value.split("").forEach(value => {
						segments[value] = intersection(segments[value], digitLookup[4]);
					});
					break;

					break;
				// for digit 8
				case 7:
					encoder[8] = value;
					// No point in intersecting it here as 8 already has the max segments
					break;
				default:
					// do nothing for now
					break;
			}
		});
		let fiveIntersection: Set<string> = signal
			.filter(value => value.length === 5)
			.map(filtered => new Set(filtered))
			.reduce((prev, current) => intersection(prev, current));
		let sixIntersection: Set<string> = signal
			.filter(value => value.length === 6)
			.map(filtered => new Set(filtered))
			.reduce((prev, current) => intersection(prev, current));

		// Top digit is always going to be the difference between digit 7 and digit 1
		const topSegmentChar = difference<string>(new Set(encoder[7]), new Set(encoder[1])).values().next().value;
		if (topSegmentChar) {
			segments[topSegmentChar] = new Set<TSegment>(["top"]);
		}
		fiveIntersection.forEach(value => {
			segments[value] = difference(segments[value], length5Intersection);
		});
		sixIntersection.forEach(value => {
			segments[value] = difference(segments[value], length6Intersection);
		});
		RemoveAllSubsets();

		// Construct digits for each value in the output

		const characterString = output
			.map(value => {
				const activeCharacters: Set<TSegment> = new Set();
				value.split("").forEach(char => {
					activeCharacters.add(segments[char].values().next().value);
				});
				let char = "";
				Object.keys(digitLookup).forEach(key => {
					const digit = digitLookup[parseInt(key)];
					if (isSetEqual(digit, activeCharacters)) {
						char = `${key}`;
					}
				});
				return char;
			})
			.join("");
		sum = sum + parseInt(characterString);
	});
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "26" }];
	const part2tests: TestCase[] = [
		{
			input: "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |cdfeb fcadb cdfeb cdbaf",
			expected: "5353",
		},
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "61229" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2021, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
