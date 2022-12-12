#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse
import numpy as np
import math

puzzle = Puzzle(year=2022, day=11)

# data = puzzle.example_data.split("\n\n")
data = puzzle.input_data.split("\n\n")


class Monkey:
    starting_items: List[int]
    operation_str: str
    test_div: int

    true_monkey: int
    false_monkey: int

    inspection_count = 0

    def __init__(self, monkey_str: str) -> Monkey:
        split_monkey_str = monkey_str.splitlines()

        items = parse("  Starting items: {}", split_monkey_str[1]).fixed[0].split(",")

        self.starting_items = list(map(int, items))
        self.operation_str = parse("  Operation: new = {}", split_monkey_str[2]).fixed[
            0
        ]
        self.test_div = parse("  Test: divisible by {:d}", split_monkey_str[3]).fixed[0]
        self.true_monkey = parse(
            "    If true: throw to monkey {:d}", split_monkey_str[4]
        ).fixed[0]
        self.false_monkey = parse(
            "    If false: throw to monkey {:d}", split_monkey_str[5]
        ).fixed[0]


troop: Dict[int, Monkey] = {}

for i, m in enumerate(data):
    troop[i] = Monkey(m)


def question(rounds, q2=False):
    lcm = math.lcm(*[monkey.test_div for monkey in troop.values()])
    print(f"Mod lcm {lcm}")
    for i in range(rounds):
        for monkey in troop.values():
            monkey.inspection_count += len(monkey.starting_items)

            while monkey.starting_items:

                item = monkey.starting_items.pop(0)
                old = item
                worry_level = eval(monkey.operation_str)

                if q2:
                    worry_level = worry_level % lcm
                else:
                    worry_level = worry_level % lcm

                new_monkey = (
                    monkey.true_monkey
                    if worry_level % monkey.test_div == 0
                    else monkey.false_monkey
                )
                troop[new_monkey].starting_items.append(worry_level)


question(20, False)
monkey_inspection_times = list(map(lambda m: m.inspection_count, troop.values()))
monkey_inspection_times.sort(reverse=True)

print(f"Question 1: {monkey_inspection_times[0]*monkey_inspection_times[1]}")

question(10000, True)
monkey_inspection_times = list(map(lambda m: m.inspection_count, troop.values()))
monkey_inspection_times.sort(reverse=True)

print(f"Question 2: {monkey_inspection_times[0]*monkey_inspection_times[1]}")
