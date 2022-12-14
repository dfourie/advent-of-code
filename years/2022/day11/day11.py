#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse
import numpy as np
import math

puzzle = Puzzle(year=2022, day=11)

data = puzzle.example_data.split("\n\n")
# data = puzzle.input_data.split("\n\n")


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

    def inspect_item(self, item: int):
        old = item
        new = eval(self.operation_str)

        worry_level = int(math.floor(new / 3.0))
        self.inspection_count += 1
        return (
            self.true_monkey if worry_level % self.test_div == 0 else self.false_monkey,
            worry_level,
        )


troop: Dict[int, Monkey] = {}

for i, m in enumerate(data):
    troop[i] = Monkey(m)


def play_round():

    for monkey in troop.values():
        # Clear the monkey's starting items
        monkey_items = list(monkey.starting_items)
        monkey.starting_items.clear()

        for item in monkey_items:
            throw_item_to_monkey, wory_item = monkey.inspect_item(item)
            troop[throw_item_to_monkey].starting_items.append(wory_item)


for i in range(20):
    play_round()

monkey_inspection_times = list(map(lambda m: m.inspection_count, troop.values()))
monkey_inspection_times.sort(reverse=True)

print(f"Question 1: {monkey_inspection_times[0]*monkey_inspection_times[1]}")
