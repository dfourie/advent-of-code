import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 15;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/15/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/15/data.txt
// problem url  : https://adventofcode.com/2021/day/15
function getPosString(y: number, x: number) {
	return `${y},${x}`;
}
function getPosFromString(pos: string) {
	return pos.split(",").map(Number) as [number, number];
}
function getNeighbours(y: number, x: number, ymax: number, xmax: number, includeDiagonals = false) {
	const out = new Set<string>();

	const constrainY = new Set([Math.max(y - 1, 0), y, Math.min(ymax, y + 1)]);
	const constrainX = new Set([Math.max(x - 1, 0), x, Math.min(xmax, x + 1)]);
	if (includeDiagonals) {
		constrainY.forEach(newY => {
			constrainX.forEach(newX => {
				out.add(getPosString(newY, newX));
			});
		});
	} else {
		constrainY.forEach(newY => {
			out.add(getPosString(newY, x));
		});

		constrainX.forEach(newX => {
			out.add(getPosString(y, newX));
		});
	}
	out.delete(getPosString(y, x));
	return [...out].map(val => getPosFromString(val));
}

class Cell {
	x: number;
	y: number;
	distance: number;
	constructor(x: number, y: number, distance: number) {
		this.x = x;
		this.y = y;
		this.distance = distance;
	}
}
// Returns cost of minimum cost path from (0,0) to (m, n) in mat[R][C] using dijkstra's
function minCost(grid: number[][]): number {
	const ymax = grid.length - 1;
	const xmax = grid[0].length - 1;
	function getOurNeighbors(y: number, x: number) {
		return getNeighbours(y, x, ymax, xmax);
	}
	const distance = Array(ymax + 1)
		.fill(0)
		.map(() => Array(xmax + 1).fill(Infinity));
	//add the first cell
	const path: Cell[] = [new Cell(0, 0, 0)];
	// Starting positon's value isn't counted
	distance[0][0] = 0;

	while (path.length !== 0) {
		// get the cell with minimum distance and delete
		// it from the set
		const k = path.shift()!;

		//loop through all neighbours
		const neighbours = getOurNeighbors(k.y, k.x);
		neighbours.forEach(neighbour => {
			const [y, x] = neighbour;
			// If distance from current cell is smaller, then
			// update distance of neighbour cell
			if (distance[x][y] > distance[k.x][k.y] + grid[x][y]) {
				// update the distance and insert new updated
				// cell in set
				distance[x][y] = distance[k.x][k.y] + grid[x][y];
				path.push(new Cell(x, y, distance[x][y]));
			}
		});
		path.sort((a, b) => {
			if (a.distance === b.distance) {
				if (a.x !== b.x) {
					return a.x - b.x;
				} else {
					return a.y - b.y;
				}
			} else {
				return a.distance - b.distance;
			}
		});
	}
	return distance[ymax][xmax];
}

async function p2021day15_part1(input: string, ...params: any[]) {
	// create a grid of numbers

	const grid = input.split("\n").map(val => val.split("").map(Number));

	return minCost(grid);
}

async function p2021day15_part2(input: string, ...params: any[]) {
	const grid = input.split("\n").map(val => val.split("").map(Number));
	const length = grid.length;
	const riskLevelMap = Array.from({ length: 5 * length }, (_, y) =>
		Array.from({ length: 5 * length }, (_, x) => {
			const risk = grid[y % length][x % length] + Math.floor(y / length) + Math.floor(x / length);
			return risk > 9 ? risk - 9 : risk;
		})
	);
	// console.log(getGridString(riskLevelMap));

	return minCost(riskLevelMap);
}

async function run() {
	const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "40" }];
	const part2tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "315" }];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day15_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day15_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day15_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day15_part2(input));
	const part2After = performance.now();

	logSolution(15, 2021, part1Solution, part2Solution);

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
