import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 16;

// solution path: /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/16/index.ts
// data path    : /Users/david/Workspace/advent-of-code/advent-of-code/years/2021/16/data.txt
// problem url  : https://adventofcode.com/2021/day/16

interface IParsedPacket {
	start: number;
	end: number;
	version: number;
	ID: number;
	literalValues: string[];
	packets: IParsedPacket[];
}

type TState = "ParsingVersion" | "ParsingPacketID" | "LITERAL" | "OPERATOR" | "ENDZEROS" | "ENDSTATE";
// Behavior states for when the version is 4
// Group is for the set of 5 bits that start with a one
// Last is for set of 5 bits that starts with a zero
type TLiteralState = "GROUP" | "LAST";

//Parsing length is when the FSM has to read how to parse
type TOperator = "ParseLength" | "TotalLength" | "TotalLengthCounting" | "Subpackets" | "SubpacketsCounting";

const hexmap: Record<string, string[]> = {
	"0": "0000".split(""),
	"1": "0001".split(""),
	"2": "0010".split(""),
	"3": "0011".split(""),
	"4": "0100".split(""),
	"5": "0101".split(""),
	"6": "0110".split(""),
	"7": "0111".split(""),
	"8": "1000".split(""),
	"9": "1001".split(""),
	A: "1010".split(""),
	B: "1011".split(""),
	C: "1100".split(""),
	D: "1101".split(""),
	E: "1110".split(""),
	F: "1111".split(""),
};

function parseWithFSM(input: string[], countSubpackets?: number) {
	let start = 0;
	let countFromStart = 0;
	let stack: string[] = [];
	// This represents packets that might be next to eachother
	let parsedPackets: IParsedPacket[] = [];
	//begin in parsing version state
	let state: TState = "ParsingVersion";
	//begin lieral state in group mode
	let operatorState: TOperator = "ParseLength";

	let version: number | undefined;

	let ID: number | undefined;

	let literal: string[] = [];
	let totalLength = 0;
	let numberOfPackets = 0;
	let childPackets: IParsedPacket[] = [];

	function step() {
		const currentPos = start + countFromStart;

		// Add return for whether FSM must finish
		if (currentPos === input.length) {
			return false;
		}

		switch (state) {
			// This is when a packet has been finished
			case "ENDSTATE":
				//Increment start to current position

				if (ID === undefined || version === undefined) {
					log(`Error at endstate at ${currentPos}`);
					return false;
				}
				parsedPackets.push({
					ID: ID,
					start,
					end: currentPos,
					version: version,
					literalValues: literal,
					packets: childPackets,
				});

				if (countSubpackets !== undefined) {
					if (countSubpackets === parsedPackets.length) {
						return false;
					}
				}

				ID = undefined;
				version = undefined;
				stack = [];
				literal = [];
				childPackets = [];
				state = "ENDZEROS";
				operatorState = "ParseLength";
				start = currentPos;
				countFromStart = 0;

				break;

			case "ENDZEROS":
				if (input.length - currentPos >= 8) {
					state = "ParsingVersion";
					start = currentPos;
				} else {
					return false;
				}
				countFromStart++;

				break;

			case "ParsingVersion":
				stack.push(input[currentPos]);

				if (stack.length === 3) {
					version = parseInt(stack.join(""), 2);
					state = "ParsingPacketID";
					stack = [];
				}
				countFromStart++;

				break;
			case "ParsingPacketID":
				stack.push(input[currentPos]);

				if (stack.length === 3) {
					ID = parseInt(stack.join(""), 2);
					stack = [];
					if (ID === 4) {
						state = "LITERAL";
					} else {
						state = "OPERATOR";
					}
				}
				countFromStart++;

				break;
			case "LITERAL":
				stack.push(input[currentPos]);

				if (stack.length === 5) {
					const firstBit = stack.shift()!;
					// If the first bit is zero, the sequence is finished.
					literal.push(stack.join(""));
					if (firstBit === "0") {
						state = "ENDSTATE";
					} else {
						countFromStart++;
					}
					//empty the stack
					stack = [];
				} else {
					countFromStart++;
				}

				break;
			case "OPERATOR":
				switch (operatorState) {
					case "ParseLength":
						if (input[currentPos] === "0") {
							operatorState = "TotalLength";
							totalLength = 0;
						} else {
							operatorState = "Subpackets";
						}
						countFromStart++;
						break;
					case "TotalLength":
						/**
						 * If the length type ID is 0, then the next 15 bits are a number that
						 * represents the total length in bits of the sub-packets contained
						 *  by this packet.
						 */
						stack.push(input[currentPos]);
						if (stack.length === 15) {
							totalLength = parseInt(stack.join(""), 2);
							operatorState = "TotalLengthCounting";
							stack = [];
						}
						countFromStart++;
						break;
					case "TotalLengthCounting":
						stack.push(input[currentPos]);
						if (stack.length === totalLength) {
							// This means we are done parsing this packet

							//parse the subpacket
							childPackets.push(...parseWithFSM(stack));
							stack = [];
							state = "ENDSTATE";
						} else {
							countFromStart++;
						}

						break;
					case "Subpackets":
						/**
						 * If the length type ID is 1, then the next 11 bits are a number
						 * that represents the number of sub-packets immediately contained
						 * by this packet.
						 */
						stack.push(input[currentPos]);
						if (stack.length === 11) {
							numberOfPackets = parseInt(stack.join(""), 2);
							operatorState = "SubpacketsCounting";
							stack = [];
						}
						countFromStart++;
						break;
					case "SubpacketsCounting":
						childPackets.push(...parseWithFSM(input.slice(currentPos), numberOfPackets));
						stack = [];
						state = "ENDSTATE";
						// Need to add the length of the subpackets
						const subpacketLength = childPackets.reduce(
							(prev, current) => prev + (current.end - current.start),
							0
						);
						countFromStart += subpacketLength;
						break;
				}

				break;

			default:
				return false;
		}
		return true;
	}
	let finish = true;
	while (finish) {
		finish = step();
	}
	return parsedPackets;
}
function hexToBinaryArray(input: string) {
	return input
		.split("")
		.map(val => hexmap[val])
		.reduce((prev, current) => [...prev, ...current], []);
}
function getVersionSum(packet: IParsedPacket): number {
	return packet.version + packet.packets.reduce((prev, current) => prev + getVersionSum(current), 0);
}

async function p2021day16_part1(input: string, ...params: any[]) {
	const binaryInput = hexToBinaryArray(input);
	// log(binaryInput.join(""));
	const packets = parseWithFSM(binaryInput);
	// const sum = packets.reduce((prev, current) => prev + current.version, 0);

	return packets.reduce((prev, current) => prev + getVersionSum(current), 0);
}
function calculateSinglePacket(packet: IParsedPacket): number {
	//calculate value of subpacket
	let value = 0;
	if (packet.literalValues.length !== 0) {
		value = parseInt(packet.literalValues.join(""), 2);
	}
	switch (packet.ID) {
		// case zero is when all the sub packets need to be added
		case 0:
			value = packet.packets.reduce((prev, current) => prev + calculateSinglePacket(current), 0);
			break;
		// case 1 is when all the sub packets need to be multipled
		case 1:
			value = packet.packets.reduce((prev, current) => prev * calculateSinglePacket(current), 1);
			break;
		// case 2 is to return the minimum value of all the subpackets
		case 2:
			value = Math.min(...packet.packets.map(val => calculateSinglePacket(val)));
			break;
		// case 3 is to return the maximum value of all the subpackets
		case 3:
			value = Math.max(...packet.packets.map(val => calculateSinglePacket(val)));
			break;
		// case 4 returns the literal value of the packet
		case 4:
			value = 0;
			if (packet.literalValues.length !== 0) {
				value = parseInt(packet.literalValues.join(""), 2);
			}
			break;
		// case 5 returns 1 if the first subpacket is greater than the second packet
		case 5:
			value = calculateSinglePacket(packet.packets[0]) > calculateSinglePacket(packet.packets[1]) ? 1 : 0;
			break;
		// case 6 returns 1 if the first subpacket is less than the seocnd packet
		case 6:
			value = calculateSinglePacket(packet.packets[0]) < calculateSinglePacket(packet.packets[1]) ? 1 : 0;
			break;
		// case 7 returns 1 if the first subpacket is equal than the seocnd packet
		case 7:
			value = calculateSinglePacket(packet.packets[0]) == calculateSinglePacket(packet.packets[1]) ? 1 : 0;
			break;
	}
	return value;
}

async function p2021day16_part2(input: string, ...params: any[]) {
	const binaryInput = hexToBinaryArray(input);
	const packets = parseWithFSM(binaryInput);

	return packets.reduce((prev, current) => prev + calculateSinglePacket(current), 0);
}

async function run() {
	const part1tests: TestCase[] = [
		// Simple literal case
		{ input: "D2FE28", expected: "6" },
		// two literal cases
		{ input: "D14A448", expected: "8" },
		// This is an operator packet with two literal subpackets
		{ input: "38006F45291200", expected: "9" },
		// This is an operator packet with 3 literal subpackets
		{ input: "EE00D40C823060", expected: "14" },
		/**
		 * 8A004A801A8002F478 represents an operator packet (version 4) which
		 * contains an operator packet (version 1) which contains an operator
		 * packet (version 5) which contains a literal value (version 6);
		 * this packet has a version sum of 16.
		 */
		{ input: "8A004A801A8002F478", expected: "16" },
		/**
		 * 620080001611562C8802118E34 represents an operator packet (version 3)
		 * which contains two sub-packets; each sub-packet is an operator packet
		 * that contains two literal values. This packet has a version sum of 12.
		 */
		{ input: "620080001611562C8802118E34", expected: "12" },
		/**
		 * C0015000016115A2E0802F182340 has the same structure as the previous example,
		 *  but the outermost packet uses a different length type ID.
		 * This packet has a version sum of 23.
		 */
		{ input: "C0015000016115A2E0802F182340", expected: "23" },
		/**
		 * A0016C880162017C3686B18A3D4780 is an operator packet that contains an operator packet
		 * that contains an operator packet that contains five literal values;
		 * it has a version sum of 31.
		 */
		{ input: "A0016C880162017C3686B18A3D4780", expected: "31" },
	];
	const part2tests: TestCase[] = [
		// this just tests the literal string combinations
		{ input: "D2FE28", expected: "2021" },
		// C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
		{ input: "C200B40A82", expected: "3" },
		// 04005AC33890 finds the product of 6 and 9, resulting in the value 54.
		{ input: "04005AC33890", expected: "54" },
		// 880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
		{ input: "880086C3E88112", expected: "7" },
		// CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
		{ input: "CE00C43D881120", expected: "9" },
		// D8005AC2A8F0 produces 1, because 5 is less than 15.
		{ input: "D8005AC2A8F0", expected: "1" },
		// F600BC2D8F produces 0, because 5 is not greater than 15.
		{ input: "F600BC2D8F", expected: "0" },
		// 9C005AC2F8F0 produces 0, because 5 is not equal to 15.
		{ input: "9C005AC2F8F0", expected: "0" },
		// 9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.
		{ input: "9C0141080250320F1802104A08", expected: "1" },
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day16_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day16_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// return;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day16_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day16_part2(input));
	const part2After = performance.now();

	logSolution(16, 2021, part1Solution, part2Solution);

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
