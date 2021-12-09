import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 9;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/09/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/09/data.txt
// problem url  : https://adventofcode.com/2021/day/9

async function p2021day9_part1(input: string, ...params: any[]) {
	const heatMap = input.split("\n").map(line => line.split("").map(Number));
	const height = heatMap.length - 1;
	const width = heatMap[0].length - 1;

	function isLowpoint(i: number, j: number) {
		const vertMin = Math.max(i - 1, 0);
		const vertMax = Math.min(i + 1, height);
		const horizMin = Math.max(j - 1, 0);
		const horizMax = Math.min(j + 1, width);
		const verticalNeighbors = [vertMin, vertMax];
		const horizantalNeighbors = [horizMin, horizMax];

		// Check each set of neighbors to make sure that no diagonals are checked.
		return (
			verticalNeighbors.every(vert => {
				if (vert === i) {
					return true;
				} else {
					return heatMap[i][j] < heatMap[vert][j];
				}
			}) &&
			horizantalNeighbors.every(horiz => {
				if (horiz === j) {
					return true;
				} else {
					return heatMap[i][j] < heatMap[i][horiz];
				}
			})
		);
	}
	let lowPointSum = 0;
	// Go through every point and determine whether it is a lowpoint or not.
	heatMap.forEach((vertical, i) => {
		vertical.forEach((pos, j) => {
			const lowPint = isLowpoint(i, j);
			if (lowPint) {
				lowPointSum += pos + 1;
			}
		});
	});
	return lowPointSum;
}

async function p2021day9_part2(input: string, ...params: any[]) {
	const heatMap = input.split("\n").map(line => line.split("").map(Number));
	const height = heatMap.length - 1;
	const width = heatMap[0].length - 1;
	// Make an array to contain whether a value has been visited
	const visited: number[][] = Array(height + 1)
		.fill(0)
		.map(() => new Array(width + 1).fill(0));

	// This counter will be used to ensure that all the basins we find
	// have a unique identifier.
	let basin_counter = 1;
	// THis saves the basin size as we traverse it
	const basinSize: Record<number, number> = {};
	/**
	 * Recursive function that will systematically explore the entire area
	 * without re-visiting places that have already been visited
	 * @param i
	 * @param j
	 * @returns
	 */
	function depthFirstSearch(i: number, j: number) {
		// This means we have hit a ridge or a visited area, so we turn around here.
		if (heatMap[i][j] === 9 || visited[i][j] !== 0) {
			return;
		} else {
			visited[i][j] = basin_counter;
			// Calculate the size of this basin
			if (basin_counter in basinSize) {
				basinSize[basin_counter] = basinSize[basin_counter] + 1;
			} else {
				basinSize[basin_counter] = 1;
			}

			// first check vertical neighbors
			const verticalNeighbors = [Math.max(i - 1, 0), Math.min(i + 1, height)];
			verticalNeighbors.forEach(vert => {
				if (vert !== i) {
					depthFirstSearch(vert, j);
				}
			});

			// first then check vertical neighbors
			const horizantalNeighbors = [Math.max(j - 1, 0), Math.min(j + 1, width)];
			horizantalNeighbors.forEach(horiz => {
				if (horiz !== j) {
					depthFirstSearch(i, horiz);
				}
			});
		}
	}
	heatMap.forEach((line, i) => {
		line.forEach((pos, j) => {
			// Perform a depth first search at this position

			depthFirstSearch(i, j);
			basin_counter++;
		});
	});
	// Get a list of all the basin sizes and sort them.
	const basins = Object.values(basinSize);
	basins.sort((a, b) => b - a);

	return basins[0] * basins[1] * basins[2];
}

async function run() {
	const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "15" }];
	const part2tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "1134" }];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2021, part1Solution, part2Solution);

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
