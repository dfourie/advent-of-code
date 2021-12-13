import _ from "lodash";
import * as util from "../../../util/util";
import { Cell, Grid, GridPos } from "../../../util/grid";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 11;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/11/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/11/data.txt
// problem url  : https://adventofcode.com/2021/day/11

async function p2021day11_part1(input: string, ...params: any[]) {
	const grid = new Grid({ serialized: input });
	let numberOfFlashed = 0;
	grid.setCustomSigilFunction((sigil: string) => {
		switch (sigil) {
			case "0":
				return chalk.redBright;
			case "9":
				return chalk.yellowBright;
			default:
				return chalk.white;
		}
	});
	log("Before any steps:");
	grid.log(false);
	// This function updates every cell where its neighbour changes
	function updateFromNeighbours() {
		const hasFlashed: string[] = [];
		function cellPosString(cell: Cell) {
			return `${cell.position.join(",")}`;
		}
		function flashCell(cell: Cell) {
			const cellpos = cellPosString(cell);

			if (hasFlashed.includes(cellpos)) {
				return;
			}
			const cellIntVal = parseInt(cell.value);

			if (cellIntVal > 9) {
				// Indicate that this cell has flashed
				hasFlashed.push(cellpos);
				numberOfFlashed++;
				cell.neighbors(true).forEach(neighbour => {
					flashCell(neighbour);
				});
			} else {
				cell.setValue(`${cellIntVal + 1}`, true);
			}
		}
		let changed = true;
		while (changed) {
			changed = false;
			const oldFlashed = numberOfFlashed;
			for (const cell of grid) {
				if (parseInt(cell.value) > 9) {
					flashCell(cell);
				}
			}
			changed = numberOfFlashed !== oldFlashed;
		}

		hasFlashed.forEach(val => {
			const pos = val.split(",");

			grid.getCell(pos as unknown as GridPos)?.setValue("0");
		});
	}
	function updateLevel() {
		grid.simulateCellularAutomata(1, (cell, grid) => {
			// Get integer value of cell
			let gridVal = parseInt(cell.value) + 1;
			return `${gridVal}`;
		});
	}

	function step(stepNumber?: number) {
		updateLevel();
		updateFromNeighbours();

		if (stepNumber !== undefined) {
			if (stepNumber % 10 === 0) {
				log(`\n After step ${stepNumber + 1}:`);
				grid.log(false);
			}
		}
	}
	for (let i = 0; i < 100; i++) {
		step();
	}

	return numberOfFlashed;
}

async function p2021day11_part2(input: string, ...params: any[]) {
	const grid = new Grid({ serialized: input });
	let numberOfFlashed = 0;
	grid.setCustomSigilFunction((sigil: string) => {
		switch (sigil) {
			case "0":
				return chalk.redBright;
			case "9":
				return chalk.yellowBright;
			default:
				return chalk.white;
		}
	});
	log("Before any steps:");
	grid.log(false);
	// This function updates every cell where its neighbour changes
	function updateFromNeighbours(): boolean {
		const hasFlashed: string[] = [];
		function cellPosString(cell: Cell) {
			return `${cell.position.join(",")}`;
		}
		function flashCell(cell: Cell) {
			const cellpos = cellPosString(cell);

			if (hasFlashed.includes(cellpos)) {
				return;
			}
			const cellIntVal = parseInt(cell.value);

			if (cellIntVal > 9) {
				// Indicate that this cell has flashed
				hasFlashed.push(cellpos);
				numberOfFlashed++;
				cell.neighbors(true).forEach(neighbour => {
					flashCell(neighbour);
				});
			} else {
				cell.setValue(`${cellIntVal + 1}`, true);
			}
		}
		let changed = true;
		while (changed) {
			changed = false;
			const oldFlashed = numberOfFlashed;
			for (const cell of grid) {
				if (parseInt(cell.value) > 9) {
					flashCell(cell);
				}
			}
			changed = numberOfFlashed !== oldFlashed;
		}

		hasFlashed.forEach(val => {
			const pos = val.split(",");

			grid.getCell(pos as unknown as GridPos)?.setValue("0");
		});
		return hasFlashed.length === 100;
	}
	function updateLevel() {
		grid.simulateCellularAutomata(1, (cell, grid) => {
			// Get integer value of cell
			let gridVal = parseInt(cell.value) + 1;
			return `${gridVal}`;
		});
	}

	function step(stepNumber?: number): boolean {
		updateLevel();
		const notsimul = updateFromNeighbours();

		if (stepNumber !== undefined) {
			// if (stepNumber % 10 === 0) {
			log(`\n After step ${stepNumber + 1}:`);
			grid.log(false);
			// }
		}
		return notsimul;
	}
	let simlflash = true;
	let i = 0;
	while (simlflash) {
		simlflash = !step(i);
		i++;
	}

	return i;
}

async function run() {
	const part1tests: TestCase[] = [
		{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "1656" },
		// { input: await util.getInput(DAY, YEAR, undefined, "small"), expected: "1656" },
	];
	const part2tests: TestCase[] = [{ input: await util.getInput(DAY, YEAR, undefined, "sample"), expected: "195" }];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2021, part1Solution, part2Solution);

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
