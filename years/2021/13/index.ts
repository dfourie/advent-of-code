import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 13;

function getCoords(position: string) {
	return position.split(",").map(Number);
}
// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/13/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/13/data.txt
// problem url  : https://adventofcode.com/2021/day/13
function coordsToArray(coords: Set<coordTuple>, char = ".", char2 = "#") {
	let x_max = 0;
	let y_max = 0;

	coords.forEach(coord => {
		if (coord[0] > x_max) {
			x_max = coord[0];
		}
		if (coord[1] > y_max) {
			y_max = coord[1];
		}
	});
	const output: string[][] = new Array(y_max + 1).fill(false).map(() => new Array(x_max + 1).fill(char));
	coords.forEach(coord => {
		output[coord[1]][coord[0]] = char2;
	});
	const outputLines = output.map(xs => `${xs.join("")}`).join("\n");
	return outputLines;
}
type coordTuple = [number, number];
async function p2021day13_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const space = lines.indexOf("");
	const coords = new Set(
		lines.slice(0, space).map((val): coordTuple => {
			const coords = getCoords(val);
			return [coords[0], coords[1]];
		})
	);
	const folds = lines.slice(space + 1).map(fold => fold.split(" ")[2].split("="));

	function fold(direction: "x" | "y", position: string) {
		const newVals = new Set<coordTuple>();
		const removeVals = new Set<coordTuple>();
		const intPosition = parseInt(position);
		if (direction === "y") {
			coords.forEach(coord => {
				if (coord[1] > intPosition) {
					removeVals.add(coord);
					const newYcoordinate = intPosition - (coord[1] - intPosition);
					newVals.add([coord[0], newYcoordinate]);
				}
			});
		}
		if (direction === "x") {
			coords.forEach(coord => {
				if (coord[0] > intPosition) {
					removeVals.add(coord);
					const newXcoordinate = intPosition - (coord[0] - intPosition);
					newVals.add([newXcoordinate, coord[1]]);
				}
			});
		}
		// Remove every value in removevals from coords
		removeVals.forEach(val => {
			if (coords.has(val)) {
				coords.delete(val);
			}
		});
		// Union every value in new Vals to coords
		newVals.forEach(val => {
			coords.add(val);
		});
	}
	// perform one fold
	fold(folds[0][0] as "x" | "y", folds[0][1]);

	return coords.size;
}

async function p2021day13_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const space = lines.indexOf("");
	const coords = new Set(
		lines.slice(0, space).map((val): coordTuple => {
			const coords = getCoords(val);
			return [coords[0], coords[1]];
		})
	);
	const folds = lines.slice(space + 1).map(fold => fold.split(" ")[2].split("="));

	function fold(direction: "x" | "y", position: string) {
		const newVals = new Set<coordTuple>();
		const removeVals = new Set<coordTuple>();
		const intPosition = parseInt(position);
		if (direction === "y") {
			coords.forEach(coord => {
				if (coord[1] > intPosition) {
					removeVals.add(coord);
					const newYcoordinate = intPosition - (coord[1] - intPosition);
					newVals.add([coord[0], newYcoordinate]);
				}
			});
		}
		if (direction === "x") {
			coords.forEach(coord => {
				if (coord[0] > intPosition) {
					removeVals.add(coord);
					const newXcoordinate = intPosition - (coord[0] - intPosition);
					newVals.add([newXcoordinate, coord[1]]);
				}
			});
		}
		// Remove every value in removeVals from coords
		removeVals.forEach(val => {
			if (coords.has(val)) {
				coords.delete(val);
			}
		});
		// Union every value in new Vals to coords
		newVals.forEach(val => {
			coords.add(val);
		});
	}
	// perform all the folds

	folds.forEach(newFold => {
		fold(newFold[0] as "x" | "y", newFold[1]);
	});
	return `\n${coordsToArray(coords, " ", "█")}`;
}

async function run() {
	const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "17" }];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day13_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day13_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day13_part2(input));
	const part2After = performance.now();

	logSolution(13, 2021, part1Solution, part2Solution);

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
