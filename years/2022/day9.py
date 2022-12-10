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
# %%

# Dict to hold place of head, tail and visited
current_head_pos = np.array([0, 0])
current_tail_pos = np.array([0, 0])
placeholder: Dict[str, str] = {}


def get_coord_string(coord):
    return f"{coord[0]}-{coord[1]}"


def move_one(amount: np.array):
    global current_head_pos
    global placeholder
    global current_tail_pos

    # Add the amount that the head is moved by
    new_head_pos = current_head_pos + amount
    # Mark the position of the new head

    new_tail_pos = current_tail_pos

    # Next figure out whether the tail needs to move or not.
    new_dist = np.linalg.norm(new_head_pos - current_tail_pos)

    # is_linear_move = new_dist.is_integer()
    not_touch_after_move = math.floor(new_dist) >= 2.0
    # If the distance is either integer or more than root 2 diagonally apart
    if not_touch_after_move:
        # Mark the current tail positon as visited
        placeholder[get_coord_string(current_tail_pos)] = "V"
        new_tail_pos = current_head_pos
        # Now mark the new tail position
        placeholder[get_coord_string(new_tail_pos)] = "T"

    # update location
    current_head_pos = new_head_pos
    current_tail_pos = new_tail_pos


for instruction in instructions:
    command, amount = instruction
    amount = int(amount)

    if command == "U":
        for i in range(amount):
            move_one(np.array([1, 0]))

    if command == "D":
        for i in range(amount):
            move_one(np.array([-1, 0]))
    if command == "L":
        for i in range(amount):
            move_one(np.array([0, -1]))
    if command == "R":
        for i in range(amount):
            move_one(np.array([0, 1]))

print(f"Question 1 {len(placeholder.keys())}")
