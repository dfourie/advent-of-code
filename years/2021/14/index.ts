import _, { keys } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { AccumulatorDict } from "../../../util/dicts";

const YEAR = 2021;
const DAY = 14;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/14/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/14/data.txt
// problem url  : https://adventofcode.com/2021/day/14

function breakIntoPairDict(poly: string) {
	const output: Record<string, number> = {};
	for (let i = 0; i < poly.length - 1; i++) {
		const pair = `${poly[i]}${poly[i + 1]}`;
		if (pair in output) {
			output[pair]++;
		} else {
			output[pair] = 1;
		}
	}
	return output;
}
async function p2021day14_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let template = lines[0];

	const instructions = lines.slice(2).map(val => val.split(" -> ") as [string, string]);
	const instructionMap = instructions.reduce<Record<string, string>>((prev, current) => {
		return { ...prev, ...{ [current[0]]: current[1] } };
	}, {});
	const letters: Record<string, number> = {};
	//populate letter count with template
	template.split("").forEach(letter => {
		if (letter in letters) {
			letters[letter]++;
		} else {
			letters[letter] = 1;
		}
	});

	let elementMap = breakIntoPairDict(template);
	function step() {
		const newPairs: Record<string, number> = {};

		// Loop through each pair in pair map
		for (const pair of Object.keys(elementMap)) {
			// if (pair in instructionMap) {
			const currentCount = elementMap[pair];
			const b = instructionMap[pair];
			const [a, c] = pair.split("");
			const ab = `${a}${b}`;
			const bc = `${b}${c}`;
			// Accumulate pairs
			if (ab in newPairs) {
				newPairs[ab] += currentCount;
			} else {
				newPairs[ab] = currentCount;
			}

			if (bc in newPairs) {
				newPairs[bc] += currentCount;
			} else {
				newPairs[bc] = currentCount;
			}

			// count letters
			if (b in letters) {
				letters[b] += currentCount;
			} else {
				letters[b] = currentCount;
			}
			// }
		}
		elementMap = newPairs;
	}
	for (let i = 0; i < 10; i++) {
		step();
	}
	//now find min and max letters
	let min = Infinity;
	let max = 0;

	for (const letterCount of Object.values(letters)) {
		if (letterCount > max) {
			max = letterCount;
		}
		if (letterCount < min) {
			min = letterCount;
		}
	}

	return max - min;
}

async function p2021day14_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let template = lines[0];

	const instructions = lines.slice(2).map(val => val.split(" -> ") as [string, string]);
	const instructionMap = instructions.reduce<Record<string, string>>((prev, current) => {
		return { ...prev, ...{ [current[0]]: current[1] } };
	}, {});
	const letters: Record<string, number> = {};
	//populate letter count with template
	template.split("").forEach(letter => {
		if (letter in letters) {
			letters[letter]++;
		} else {
			letters[letter] = 1;
		}
	});

	let elementMap = breakIntoPairDict(template);
	function step() {
		const newPairs: Record<string, number> = {};

		// Loop through each pair in pair map
		for (const pair of Object.keys(elementMap)) {
			// if (pair in instructionMap) {
			const currentCount = elementMap[pair];
			const b = instructionMap[pair];
			const [a, c] = pair.split("");
			const ab = `${a}${b}`;
			const bc = `${b}${c}`;
			// Accumulate pairs
			if (ab in newPairs) {
				newPairs[ab] += currentCount;
			} else {
				newPairs[ab] = currentCount;
			}

			if (bc in newPairs) {
				newPairs[bc] += currentCount;
			} else {
				newPairs[bc] = currentCount;
			}

			// count letters
			if (b in letters) {
				letters[b] += currentCount;
			} else {
				letters[b] = currentCount;
			}
			// }
		}
		elementMap = newPairs;
	}
	for (let i = 0; i < 40; i++) {
		step();
	}
	//now find min and max letters
	let min = Infinity;
	let max = 0;

	for (const letterCount of Object.values(letters)) {
		if (letterCount > max) {
			max = letterCount;
		}
		if (letterCount < min) {
			min = letterCount;
		}
	}

	return max - min;
}

async function run() {
	const part1tests: TestCase[] = [
		// { input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "1588" }
	];
	const part2tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "2188189693529" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day14_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day14_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day14_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day14_part2(input));
	const part2After = performance.now();

	logSolution(14, 2021, part1Solution, part2Solution);

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
