import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 10;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/10/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/10/data.txt
// problem url  : https://adventofcode.com/2021/day/10

const sets = ["<>", "{}", "()", "[]"];
const right = [">", "}", ")", "]"];
const score: Record<string, number> = {
	")": 3,
	"]": 57,
	"}": 1197,
	">": 25137,
};
// Index on the left brakets to make it easier
const autoCompleteScore: Record<string, number> = {
	"(": 1,
	"[": 2,
	"{": 3,
	"<": 4,
};

function isIncomplete(line: string) {
	// A line is incomplete if it still contains some right brakets
	return !right.some(c => line.includes(c));
}

function removePairs(line: string): string {
	let end = true;
	let lineNoPairs = line;
	// Loop until all bracket pairs are removed
	while (end) {
		let newLine = lineNoPairs;
		sets.forEach(set => {
			newLine = newLine.replace(set, "");
		});
		end = newLine != lineNoPairs;
		lineNoPairs = newLine;
	}
	return lineNoPairs;
}
function findFirstRightBraket(line: string) {
	// Exclude all the non right brakets, then take first one
	return line.split("").filter(c => right.includes(c))[0];
}

async function p2021day10_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let sum = 0;
	lines.forEach(line => {
		const lineNoPairs = removePairs(line);
		if (!isIncomplete(lineNoPairs)) {
			const firstNonMatch = findFirstRightBraket(lineNoPairs);
			sum = sum + score[firstNonMatch];
		}
	});
	return sum;
}

async function p2021day10_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const autoScore: number[] = [];
	lines.forEach(line => {
		const lineNoPairs = removePairs(line);
		if (isIncomplete(lineNoPairs)) {
			autoScore.push(
				lineNoPairs
					.split("")
					//The values we need to add are the ones that are left behind, so play them in reverse order
					.reverse()
					// Get the score for each value
					.map(val => autoCompleteScore[val])
					// This reduce starts at zero, then performs multiplies that value by 5 and adds the mapped score
					.reduce((prev, current) => {
						return prev * 5 + current;
					}, 0)
			);
		}
	});
	// Return middlemost score
	autoScore.sort((a, b) => a - b);
	const mid = Math.floor(autoScore.length / 2);
	return autoScore[mid];
}

async function run() {
	const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "26397" }];
	const part2tests: TestCase[] = [
		{ input: "<{([{{}}[<[[[<>{}]]]>[]]", expected: "294" },
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "288957" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day10_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day10_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day10_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day10_part2(input));
	const part2After = performance.now();

	logSolution(10, 2021, part1Solution, part2Solution);

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
