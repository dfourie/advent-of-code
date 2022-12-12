#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional, Tuple, Set, Callable
from collections import deque
import copy
from parse import parse
import numpy as np
import math

puzzle = Puzzle(year=2022, day=12)

# data = [list(l) for l in puzzle.example_data.split("\n")]
data = [list(l) for l in puzzle.input_data.split("\n")]

print_data = copy.deepcopy(data)
# Find start and end locations
start = (0, 0)
end = (0, 0)

coord = Tuple[int, int]

row_max = len(data) - 1
col_max = len(data[0]) - 1

for i, row in enumerate(data):
    for j, val in enumerate(row):

        if val == "S":
            start = (i, j)
            data[i][j] = int(0)
        elif val == "E":
            end = (i, j)
            data[i][j] = int(ord("z") - ord("a"))
        else:
            # Convert to sane map
            data[i][j] = int(ord(val) - ord("a"))


def find_available_nodes(pos: coord, go_up: bool) -> Set[coord]:
    nodes = set()

    node_row_max = min(row_max, pos[0] + 1)
    node_row_min = max(0, pos[0] - 1)

    node_col_max = min(col_max, pos[1] + 1)
    node_col_min = max(0, pos[1] - 1)

    def add_node(r, c):
        val = get_data((r, c))
        current_height = get_data(pos)
        if go_up:
            if val - current_height <= 1.0:
                nodes.add((r, c))
        else:
            if current_height - val <= 1.0:
                nodes.add((r, c))

    # Up
    add_node(node_row_max, pos[1])
    # Down
    add_node(node_row_min, pos[1])
    # Left
    add_node(pos[0], node_col_min)
    # right
    add_node(pos[0], node_col_max)

    # Remove current node if it is in the neighbors
    if pos in nodes:
        nodes.remove(pos)

    return nodes


def get_data(pos: coord):
    return data[pos[0]][pos[1]]


def print_map(pos: coord):
    for i, row in enumerate(print_data):
        for j, val in enumerate(print_data):
            if (i, j) == pos:
                print("#", end="")
            else:
                print(val, end="")
        print()


def bfs(node: coord, go_up, end_condition: Callable):  # function for BFS
    visited = []  # List for visited nodes.
    queue = []  # Initialize a queue

    min_depth = 10000000
    visited.append(node)
    queue.append((node, 0))

    while queue:  # Creating loop to visit each node

        current_pos, current_depth = queue.pop(0)
        # print(f"At {current_pos} depth {current_depth}")
        neighbours = find_available_nodes(current_pos, go_up)

        if end_condition(current_pos):
            if current_depth < min_depth:
                min_depth = current_depth

            # print(f"End found! at {current_depth}")

        unvisted_neighbors = list(filter(lambda n: n not in visited, neighbours))

        for neighbour in unvisted_neighbors:

            # print(f"Visiting {neighbour} ")
            visited.append(neighbour)
            queue.append((neighbour, current_depth + 1))

    return min_depth


def end_condition_q1(current_pos: coord) -> bool:
    return current_pos == end


def end_condition_q2(current_pos: coord) -> bool:
    return get_data(current_pos) == 0


min_depth = bfs(start, True, end_condition_q1)
print(f"Question 1 {min_depth}")

min_depth = bfs(end, False, end_condition_q2)
print(f"Question 2 {min_depth}")
