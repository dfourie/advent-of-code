import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 4;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/04/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/04/data.txt
// problem url  : https://adventofcode.com/2021/day/4

class Board {
	// index every number by its value. If there are is more than one number, add it to the list
	lookup: Record<number, { row: number; col: number; found: boolean }> = {};
	// this records the number of rows
	found_rows: number[] = [0, 0, 0, 0, 0];
	// this records the number of columns
	found_cols: number[] = [0, 0, 0, 0, 0];
	// This i
	pretty: number[][] = [
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
	];

	// This records the total sum of every number on the board, when a number is found, subtract it from it
	sum = 0;

	/**
	 * Adds a number the board for initialisation
	 * @param value
	 * @param row
	 * @param col
	 */
	addNumber(value: number, row: number, col: number) {
		this.lookup[value] = { row, col, found: false };

		this.pretty[row][col] = value;

		this.sum = this.sum + value;
	}

	tickOffNumber(value: number) {
		// Get all the positions of a number

		if (value in this.lookup) {
			const element = this.lookup[value];
			this.found_rows[element.row]++;
			this.found_cols[element.col]++;
			element.found = true;
			// Subtract this value from the sum
			this.sum = this.sum - value;
			// This  means that bingo has been found for the board
			if (this.found_cols.includes(5) || this.found_rows.includes(5)) {
				// compute the result and return
				return [1, this.sum * value];
			}
		}
		return [0, 0];
	}
}

async function p2021day4_part1(input: string, ...params: any[]) {
	// break up into lines, first line is our number input.
	const lines = input.split("\n");
	const random_numbers = lines[0].split(",").map(Number);

	const boards: Board[] = [];
	let currentBoard: Board | undefined;
	let row_count = 0;
	// Add all the values to the boards
	for (let i = 1; i < lines.length; i++) {
		if (lines[i] !== "") {
			for (let j = 0; j < lines[i].length; j = j + 3) {
				currentBoard?.addNumber(parseInt(lines[i].substr(j, 2).trim()), row_count, j / 3);
			}
			row_count++;
		} else {
			if (currentBoard !== undefined) {
				boards.push(currentBoard);
			}
			currentBoard = new Board();
			row_count = 0;
		}
	}
	if (currentBoard !== undefined) {
		boards.push(currentBoard);
	}

	let [bingo, score] = [0, 0];
	for (let i = 0; i < random_numbers.length; i++) {
		const number = random_numbers[i];
		// Add the number to each board, if it scores bingo, end the loop and score!

		for (let j = 0; j < boards.length; j++) {
			[bingo, score] = boards[j].tickOffNumber(number);

			if (bingo === 1) {
				break;
			}
		}
		if (bingo === 1) {
			break;
		}
	}

	return score;
}

async function p2021day4_part2(input: string, ...params: any[]) {
	// break up into lines, first line is our number input.
	const lines = input.split("\n");
	const random_numbers = lines[0].split(",").map(Number);

	const boards: Board[] = [];
	let currentBoard: Board | undefined;
	let row_count = 0;
	// Add all the values to the boards
	for (let i = 1; i < lines.length; i++) {
		if (lines[i] !== "") {
			for (let j = 0; j < lines[i].length; j = j + 3) {
				currentBoard?.addNumber(parseInt(lines[i].substr(j, 2).trim()), row_count, j / 3);
			}
			row_count++;
		} else {
			if (currentBoard !== undefined) {
				boards.push(currentBoard);
			}
			currentBoard = new Board();
			row_count = 0;
		}
	}
	if (currentBoard !== undefined) {
		boards.push(currentBoard);
	}

	let final_score = 0;
	const won_boards: number[] = [];
	for (let i = 0; i < random_numbers.length; i++) {
		const number = random_numbers[i];
		// Add the number to each board, if it scores bingo, end the loop and score!

		for (let j = 0; j < boards.length; j++) {
			if (!won_boards.includes(j)) {
				let [bingo, score] = boards[j].tickOffNumber(number);

				if (bingo === 1) {
					final_score = score;
					won_boards.push(j);
				}
			}
		}
	}

	return final_score;
}

async function run() {
	const part1tests: TestCase[] = [];
	// const part1tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "4512" }];
	const part2tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "1924" }];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2021, part1Solution, part2Solution);

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
