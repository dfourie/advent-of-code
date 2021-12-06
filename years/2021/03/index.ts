import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 3;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/03/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/03/data.txt
// problem url  : https://adventofcode.com/2021/day/3

async function p2021day3_part1(input: string, ...params: any[]) {
	// Chnage input into matrix of numbers
	const nums = input.split("\n").map(value => value.trim().split("").map(Number));
	const length = nums.length / 2;
	// Reduce each row by summing each element in the row with the previous element
	const gamma = nums
		.reduceRight((prev, current) => {
			// Reduce each row by summing each element in the row with the previous element
			prev.forEach((val, i) => {
				current[i] = current[i] + val;
			});
			return current;
		})
		// Then map it to a binary if it is greater than half the length.
		.map(value => (value > length ? 1 : 0));
	const epsilon = gamma.map(value => (value === 1 ? 0 : 1));

	const decGamma = parseInt(gamma.join(""), 2);
	const decEpsilon = parseInt(epsilon.join(""), 2);

	return decGamma * decEpsilon;
}
/**
 *
 * @param array The array of numbers
 * @param pos the position to filter on
 * @param gt whether to use most common or least common
 */
async function filterArray(array: number[][], pos: number, gt: boolean) {
	let length = array.length / 2.0;

	// Accumulate each row in the array.
	const sum = array.map(value => value[pos]).reduce((a, b) => a + b);
	// Find the most common element by seeing if it is greater than or equal to half the length
	let filterVal = sum >= length ? 1 : 0;
	// If the function is called with gt= false, meaning we need to look for the least occuring value, then it needs to be flipped.
	filterVal = gt ? filterVal : filterVal === 1 ? 0 : 1;
	// Finally get rid of any array elements that do not match the value of filterval at the column position.
	const newArray = array.filter(value => value[pos] === filterVal);
	return newArray;
}

async function p2021day3_part2(input: string, ...params: any[]) {
	// Chnage input into matrix of numbers
	const nums = input.split("\n").map(value => value.trim().split("").map(Number));
	let pos = 0;
	let o2Copy = [...nums];
	while (o2Copy.length > 1) {
		o2Copy = await filterArray(o2Copy, pos, true);
		pos++;
	}
	const o2 = parseInt(o2Copy[0].join(""), 2);

	pos = 0;
	o2Copy = [...nums];
	while (o2Copy.length > 1) {
		o2Copy = await filterArray(o2Copy, pos, false);
		pos++;
	}
	const co2 = parseInt(o2Copy[0].join(""), 2);

	return o2 * co2;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: "00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010",
			expected: "198",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: "00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010",
			expected: "230",
		},
		// { input: "1\n1\n0\n0",expected:"1"},
		// { input: "1\n1\n0\n0\n1",expected:"1"},
		// { input: "1\n1\n0\n0\n0",expected:"0"},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2021, part1Solution, part2Solution);

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
