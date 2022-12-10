#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse
import numpy as np
import math

puzzle = Puzzle(year=2022, day=9)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()
instructions = list(map(lambda x: x.split(" "), data))

display = np.full([10, 10], ".", dtype=str)
# Dict to hold place of tail

placeholder: Dict[str, str] = {}

# Head is first, tail is last
knots = [np.array([0, 0]) for i in range(10)]


def get_coord_string(coord):
    return f"{coord[0]}-{coord[1]}"


prev_moved_pos = np.array([0, 0])
placeholder[get_coord_string(prev_moved_pos)] = "V"


def move_tails(index: int):

    global placeholder
    global knots
    global display

    # If the knot we are dealing with is the first, use the amount, else use the previous

    current_head_pos = knots[index - 1]

    # Start with the new tail positoon not moving
    new_tail_pos = knots[index]
    current_tail_pos = knots[index]
    # display[new_tail_pos[0], new_tail_pos[1]] = f"."
    diff = current_head_pos - current_tail_pos

    # is_linear_move = new_dist.is_integer()
    not_touch_after_move = np.any(np.greater(abs(diff), 1))
    # If the distance is either integer or more than root 2 diagonally apart

    if not_touch_after_move:

        new_tail_pos += np.clip(diff, -1, 1)

        # Now mark the new tail position
        if index == 9:
            # Mark the current tail positon as visited
            placeholder[get_coord_string(current_tail_pos)] = "V"

    # display[new_tail_pos[0], new_tail_pos[1]] = f"{index}"

    knots[index] = new_tail_pos


def move_head(amount: np.array):
    global knots
    global display
    global prev_moved_pos
    prev_moved_pos = knots[0]
    # display[knots[0][0], knots[0][1]] = "."
    knots[0] = knots[0] + amount
    # display[knots[0][0], knots[0][1]] = "H"


def move_head_and_tails(amount: np.array):
    move_head(amount)
    for i in range(1, 10):
        move_tails(i)


for instruction in instructions:
    command, amount = instruction
    amount = int(amount)

    if command == "U":
        for i in range(amount):
            move_head_and_tails(np.array([1, 0]))

    if command == "D":
        for i in range(amount):
            move_head_and_tails(np.array([-1, 0]))
    if command == "L":
        for i in range(amount):
            move_head_and_tails(np.array([0, -1]))
    if command == "R":
        for i in range(amount):
            move_head_and_tails(np.array([0, 1]))

print(f"Question 2 {len(placeholder.keys())}")
