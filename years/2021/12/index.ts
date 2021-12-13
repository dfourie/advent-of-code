import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import { AccumulatorDict } from "../../../util/dicts";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 12;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/12/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/12/data.txt
// problem url  : https://adventofcode.com/2021/day/12

function getNodeDict(input: string) {
	const nodes = new AccumulatorDict<string, string>();
	input.split("\n").forEach(line => {
		const [node1, node2] = line.split("-");
		nodes.addVal(node1, node2);
		if (node1 !== "start") {
			nodes.addVal(node2, node1);
		}
	});
	return nodes;
}

async function p2021day12_part1(input: string, ...params: any[]) {
	const nodes = getNodeDict(input);
	const start = nodes.dict["start"];
	delete nodes.dict["start"];
	// const smallCavesVisited: string[] = [];
	const foundPaths: string[][] = [];

	/**
	 * Node is the current node that is being visited
	 * Path is the path that has been taken to get here
	 * @param node
	 * @param path
	 * @returns
	 */
	function goToNeighbours(node: string, path: string[]) {
		// This means we have reached the end of this path, so we can turn around
		if (node === "end") {
			// Add our path to the list of found paths

			foundPaths.push([...path, "end"]);
			return;
		}
		// If this is a small cave, and it it is in the path, then return
		if (node.toLowerCase() === node) {
			if (path.includes(node)) {
				return;
			}
		}
		// add our current position to the path
		path.push(node);

		// Go through all our neighbours
		nodes.dict[node]?.forEach(newNode => {
			goToNeighbours(newNode, path);
		});
		// Once we have visited all our neighbours, return to the previous node
		path.pop();
		return;
	}
	start?.forEach(node => {
		goToNeighbours(node, ["start"]);
	});
	return foundPaths.length;
}

async function p2021day12_part2(input: string, ...params: any[]) {
	const nodes = getNodeDict(input);
	const start = nodes.dict["start"];
	delete nodes.dict["start"];
	// const smallCavesVisited: string[] = [];
	const foundPaths: string[][] = [];

	/**
	 * Node is the current node that is being visited
	 * Path is the path that has been taken to get here
	 * @param node
	 * @param path
	 * @returns
	 */
	function goToNeighbours(node: string, path: string[], visitedOneSmallCave?: string) {
		// This means we have reached the end of this path, so we can turn around

		if (node === "end") {
			// Add our path to the list of found paths

			foundPaths.push([...path, "end"]);
			return;
		}
		// If this is a small cave, and it is in the path, then return
		if (node.toLowerCase() === node) {
			if (path.includes(node)) {
				if (visitedOneSmallCave === undefined) {
					visitedOneSmallCave = node;
				} else {
					return;
				}
			}
		}
		// add our current position to the path
		path.push(node);

		// Go through all our neighbours
		nodes.dict[node]?.forEach(newNode => {
			goToNeighbours(newNode, path, visitedOneSmallCave);
		});
		// Once we have visited all our neighbours, return to the previous node
		path.pop();
		return;
	}
	start?.forEach(node => {
		goToNeighbours(node, ["start"]);
	});
	return foundPaths.length;
}

async function run() {
	const part1tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample1"), expected: "10" },
		{ input: await util.getInput(DAY, YEAR, undefined, "sample2"), expected: "19" },
		{ input: await util.getInput(DAY, YEAR, undefined, "sample3"), expected: "226" },
	];
	const part2tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample1"), expected: "36" },
		{ input: await util.getInput(DAY, YEAR, undefined, "sample2"), expected: "103" },
		{ input: await util.getInput(DAY, YEAR, undefined, "sample3"), expected: "3509" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day12_part2(input));
	const part2After = performance.now();
	// return;
	logSolution(12, 2021, part1Solution, part2Solution);

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
