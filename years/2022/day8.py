#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse
import numpy as np


puzzle = Puzzle(year=2022, day=8)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()

data = list(map(lambda x: list(map(lambda y: int(y), list(x))), data))
data = np.array(data)

interior_count = 0
for i in range(1, data.shape[0] - 1):
    for j in range(1, data.shape[1] - 1):

        up_arr = data[0:i, j]
        down_arr = data[i + 1 :, j]
        left_arr = data[i, 0:j]
        right_arr = data[i, j + 1 :]

        if (
            data[i, j] > up_arr.max()
            or data[i, j] > down_arr.max()
            or data[i, j] > left_arr.max()
            or data[i, j] > right_arr.max()
        ):
            interior_count += 1
perimeter_count = 2 * len(data) + 2 * len(data[0]) - 4
print(f"Question 1 {interior_count + perimeter_count}")
# %% Question2
def get_view_distance(tree_height: int, arr: np.array):
    dist = 0
    for check_tree in arr:
        dist += 1
        if tree_height <= check_tree:
            break

    return dist


max_score = 0
for i in range(1, data.shape[0] - 1):
    for j in range(1, data.shape[1] - 1):

        tree_height = data[i, j]
        up_arr = data[0:i, j]
        down_arr = data[i + 1 :, j]
        left_arr = data[i, 0:j]
        right_arr = data[i, j + 1 :]

        up_dist = get_view_distance(tree_height, up_arr[::-1])
        down_dist = get_view_distance(tree_height, down_arr)
        left_dist = get_view_distance(tree_height, left_arr[::-1])
        right_dist = get_view_distance(tree_height, right_arr)
        score = up_dist * down_dist * left_dist * right_dist
        if score > max_score:
            max_score = score

print(f"Question 2 {max_score}")
