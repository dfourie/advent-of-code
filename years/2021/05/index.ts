import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 5;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/05/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/05/data.txt
// problem url  : https://adventofcode.com/2021/day/5

function findAllPointsBetweenTwoCoordinatesAndReturnList(coord1: number[], coord2: number[]): string[] {
	const dx = coord1[0] - coord2[0];
	const dy = coord1[1] - coord2[1];
	const output: string[] = [];

	// If the line is vertical, then simply move up or down
	if (dx === 0) {
		const x = coord1[0];

		if (dy < 0) {
			for (let i = coord1[1]; i <= coord2[1]; i += 1) {
				output.push(getRef([x, i]));
			}
		} else {
			for (let i = coord1[1]; i >= coord2[1]; i -= 1) {
				output.push(getRef([x, i]));
			}
		}
		// If line is horizantal, simply move acroos
	} else if (dy === 0) {
		const y = coord1[1];

		if (dx < 0) {
			for (let i = coord1[0]; i <= coord2[0]; i += 1) {
				output.push(getRef([i, y]));
			}
		} else {
			for (let i = coord1[0]; i >= coord2[0]; i -= 1) {
				output.push(getRef([i, y]));
			}
		}
	} else if (dx / dy === 1 || dx / dy === -1) {
		// Get Y intercept
		const m = dy / dx;
		const c = coord1[1] - m * coord1[0];
		function y(x: number) {
			return m * x + c;
		}

		// if dx is negative, coord1 < coord 2, therefore iterate on postivie x from coord1 to coord2
		if (dx < 0) {
			for (let i = coord1[0]; i <= coord2[0]; i += 1) {
				output.push(getRef([i, y(i)]));
			}
		} else {
			for (let i = coord1[0]; i >= coord2[0]; i -= 1) {
				output.push(getRef([i, y(i)]));
			}
		}
	}
	return output;
}

const getRef = (coord: number[]) => `${coord[0]},${coord[1]}`;
async function p2021day5_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const grid: Record<string, number> = {};

	function addToGrid(coord1Ref: string) {
		if (coord1Ref in grid) {
			grid[coord1Ref] = grid[coord1Ref] + 1;
		} else {
			grid[coord1Ref] = 1;
		}
	}
	lines.forEach(line => {
		// Parse each line into its coordinates
		const [coord1, coord2] = line.split(" -> ").map(value =>
			value
				.trim()
				.split(",")
				.map(value => parseInt(value.trim()))
		);

		// Only consider horizantal or vertical lines for now...
		if (coord1[0] === coord2[0] || coord1[1] === coord2[1]) {
			findAllPointsBetweenTwoCoordinatesAndReturnList(coord1, coord2).forEach(line => {
				addToGrid(line);
			});
		}
	});
	let sum = 0;

	Object.keys(grid).map(value => {
		if (grid[value] >= 2) {
			sum += 1;
		}
	});

	return sum;
}

async function p2021day5_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const grid: Record<string, number> = {};

	function addToGrid(coord1Ref: string) {
		if (coord1Ref in grid) {
			grid[coord1Ref] = grid[coord1Ref] + 1;
		} else {
			grid[coord1Ref] = 1;
		}
	}
	lines.forEach(line => {
		// Parse each line into its coordinates
		const [coord1, coord2] = line.split(" -> ").map(value =>
			value
				.trim()
				.split(",")
				.map(value => parseInt(value.trim()))
		);

		findAllPointsBetweenTwoCoordinatesAndReturnList(coord1, coord2).forEach(line => {
			addToGrid(line);
		});
	});
	let sum = 0;

	Object.keys(grid).map(value => {
		if (grid[value] >= 2) {
			sum += 1;
		}
	});

	return sum;
}

async function run() {
	const part1tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "5" },
		{ input: "7,0 -> 7,4\n7,4 -> 7,0", expected: "5" },
		{ input: "0,7 -> 4,7\n4,7 -> 0,7", expected: "5" },
	];
	const part2tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "12" },
		{ input: "7,0 -> 7,4\n7,4 -> 7,0", expected: "5" },
		{ input: "0,7 -> 4,7\n4,7 -> 0,7", expected: "5" },
		{ input: "1,1 -> 3,3\n3,3 -> 1,1", expected: "3" },
		{ input: "4,0 -> 0,4\n0,0 -> 4,4", expected: "1" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2021, part1Solution, part2Solution);

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
