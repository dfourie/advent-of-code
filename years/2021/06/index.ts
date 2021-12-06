import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 6;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/06/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/06/data.txt
// problem url  : https://adventofcode.com/2021/day/6

class Fish {
	timer = 8;

	constructor(timer?: number) {
		if (timer !== undefined) {
			this.timer = timer;
		}
	}

	increment() {
		// This is when a new fish gets created
		if (this.timer === 0) {
			this.timer = 6;
			return new Fish();
		} else {
			this.timer--;
			return undefined;
		}
	}
}

function calculate_fish(input: string, days: number) {
	const initialState = input.split(",").map(value => Number(value.trim()));
	// Get initial state
	let school = initialState.map(value => new Fish(value));
	let new_fish: Fish[] = [];

	// log(`Initial state: ${initialState}`);
	for (let i = 0; i < days; i++) {
		new_fish = [];
		// Increment each day
		school.forEach(fish => {
			let newFish = fish.increment();

			if (newFish !== undefined) {
				new_fish.push(newFish);
			}
		});
		//Add new fish to school
		school = [...school, ...new_fish];
		// log(`After ${i + 1} day: ${school.map(fish => fish.timer)}`);
	}

	return school.length;
}
class TimerSchool {
	school: Record<number, number> = {};

	addFish(timer: number, numberOfFish: number) {
		if (timer in this.school) {
			this.school[timer] = this.school[timer] + numberOfFish;
		} else {
			this.school[timer] = numberOfFish;
		}
	}
	computeNewSchool() {
		const newSchool = new TimerSchool();
		// Loop through timers
		Object.keys(this.school).forEach(key => {
			// Sillyness because of object.keys
			const intKey = parseInt(key);
			// This means that new fish are needed. We know how many to add
			if (intKey === 0) {
				// Add this amount of new fish
				newSchool.addFish(8, this.school[intKey]);
				// The new school also needs the old fish, but they start at 6
				newSchool.addFish(6, this.school[intKey]);
			} else {
				// For every other class, simply add it into a new timer
				newSchool.addFish(intKey - 1, this.school[intKey]);
			}
		});
		return newSchool;
	}
	computerNumberOfFish() {
		let total = 0;
		Object.values(this.school).forEach(value => {
			total += value;
		});
		return total;
	}
}

function fastFishTransform(input: string, days: number) {
	// Instead of naively keeping each fish, we group them together by their timers. This means that
	// Complexity doesn't increase with time
	let school = new TimerSchool();
	const initialState = input.split(",").map(value => Number(value.trim()));
	initialState.forEach(fishInitial => {
		school.addFish(fishInitial, 1);
	});
	for (let i = 0; i < days; i++) {
		school = school.computeNewSchool();
	}

	return school.computerNumberOfFish();
}

async function p2021day6_part1(input: string, ...params: any[]) {
	return fastFishTransform(input, 80);
}

async function p2021day6_part2(input: string, ...params: any[]) {
	return fastFishTransform(input, 256);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [{ input: "3,4,3,1,2", expected: "26984457539" }];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2021, part1Solution, part2Solution);

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
