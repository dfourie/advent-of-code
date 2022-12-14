#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional, Tuple, Set, Callable
from collections import deque
import copy
from parse import parse
import numpy as np
import math
from functools import cmp_to_key

puzzle = Puzzle(year=2022, day=14)

# data = puzzle.example_data
data = puzzle.input_data

global_grid: Dict[Tuple[int, int], str] = {}


global_min_y = 10000000
global_min_x = 100000000
global_max_x = 0
global_max_y = 0


def map_str_to_tuple(string: str):
    x, y = string.split(",")
    return (int(x), int(y))


for line in data.splitlines():
    coords = line.split(" -> ")

    for i, coord in enumerate(coords[:-1]):
        first = map_str_to_tuple(coord)
        second = map_str_to_tuple(coords[i + 1])

        min_x = min(first[0], second[0])
        max_x = max(first[0], second[0])
        min_y = min(first[1], second[1])
        max_y = max(first[1], second[1])

        global_max_x = max(max_x, global_max_x)
        global_max_y = max(max_y, global_max_y)
        global_min_x = min(min_x, global_min_x)
        global_min_y = min(min_y, global_min_y)
        for x in range(min_x, max_x + 1):
            for y in range(min_y, max_y + 1):
                global_grid[(x, y)] = "#"


diff_x = global_max_x - global_min_x + 20
diff_y = global_max_y - global_min_y + 20


def display_grid(d_grid):
    display = np.full((diff_y + 1, diff_x + 1), " ")
    for coord, val in d_grid.items():
        display[coord[1] - global_min_y + 10, coord[0] - global_min_x + 10] = val
    for i in range(display.shape[0]):
        for j in range(display.shape[1]):
            print(display[i, j], end="")
        print()


# Simulate sand


def simulate_sand(use_floor=False):
    grid = copy.deepcopy(global_grid)
    # Simulate sand
    floor = global_max_y + 2

    def check_grid(coord):
        if not use_floor:
            return coord in grid
        else:
            if coord[1] == floor:
                return True
            else:
                return coord in grid

    starting_pos = (500, 0)
    end_sim = True
    num_sand = 0
    while end_sim:
        sand = copy.copy(starting_pos)

        while True:

            down = check_grid((sand[0], sand[1] + 1))
            left = check_grid((sand[0] - 1, sand[1] + 1))
            right = check_grid((sand[0] + 1, sand[1] + 1))

            if not use_floor:
                # Check to see whether we are in the abyss:
                if sand[1] > global_max_y + 1:
                    end_sim = False
                    break
            else:
                # If we are blocked and the next piece of sand is below the starting block, then we are done
                if down and left and right and (sand[0], sand[1] + 1) == (500, 1):
                    end_sim = False
                    break

            # Check to see whether the sand has hit something
            if down:
                if left and right:
                    # If both left and right are blocked, then add sand to grid
                    grid[sand] = "o"
                    num_sand += 1
                    # print()
                    # display_grid(grid)
                    break
                else:
                    # If left isn't blocked, then that must be the new coord, else use right
                    if not left:
                        sand = (sand[0] - 1, sand[1] + 1)
                    else:
                        sand = (sand[0] + 1, sand[1] + 1)

            # Move the sand down
            else:
                sand = (sand[0], sand[1] + 1)
    return num_sand


print(f"Question 1 {simulate_sand(False)}")
print(f"Question 2 {simulate_sand(True)}")
